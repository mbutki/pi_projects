import time
from datetime import datetime
import json
import argparse
import random
import os

import epd7in5_V2
import epdconfig
from PIL import Image,ImageDraw,ImageFont,ImageFilter, ImageOps
import mariadb
import numpy as np

from weather import db_reads

PI_DIR = '/home/mbutki/pi_projects'

db_config = json.load(open(f'{PI_DIR}/db.config'))

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

class Anime:
    def __init__(self, name, dither, dir_name):
        self.name = name
        self.dither = dither
        self.dir_path = os.path.abspath(dir_name)
        self.filenames = [os.path.join(self.dir_path, f) for f in os.listdir(self.dir_path) if os.path.isfile(os.path.join(self.dir_path, f))]

    def get_rand_img(self):
        filename = random.choice(self.filenames)
        img = prepare_manga_page_crop_to_aspect(filename)
        img = stretch_contrast(img)
        img = self.dither(img)
        return img

def main():
    try:
        run()
    except IOError as e:
        print(e)
    except KeyboardInterrupt:
        print("ctrl + c:")
        exit()

def fetchData():
    weather = None
    conn = None

    try:
        if args.v:
            print('Opening DB...')
        conn = mariadb.connect(
            user="mbutki",
            host="pi-desk",
            database="pidata"
        )

        conn.autocommit = True
        if args.v:
            print('Get Cursor')
        cur = conn.cursor()

        weather = db_reads.fetch_weather(cur, args)

        conn.commit()
        conn.close()

        if args.v:
            print('DB client closed')
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return None

    return weather

def clean_refresh(epd):
    """Flushes the screen with white, resets ghosting, and re-initializes grayscale mode."""
    epd.init_4Gray()
    epd.Clear()

    blank = Image.new('L', (epd.height, epd.width), 255)
    epd.display_4Gray(epd.getbuffer_4Gray(blank))

    time.sleep(1)
    epd.sleep()

    # Wake again in 4-gray mode
    epd.init_4Gray()

def dither_to_4gray(image):
    image = image.convert("L")
    arr = np.array(image, dtype=np.float32)

    height, width = arr.shape
    for y in range(height):
        for x in range(width):
            old = arr[y, x]
            new = round(old / 85) * 85
            arr[y, x] = new
            quant_error = old - new
            if x + 1 < width:
                arr[y, x + 1] += quant_error * 7 / 16
            if x - 1 >= 0 and y + 1 < height:
                arr[y + 1, x - 1] += quant_error * 3 / 16
            if y + 1 < height:
                arr[y + 1, x] += quant_error * 5 / 16
            if x + 1 < width and y + 1 < height:
                arr[y + 1, x + 1] += quant_error * 1 / 16

    arr = np.clip(arr, 0, 255)
    return Image.fromarray(arr.astype(np.uint8), mode="L")


def bayer_dither_4gray(image, white_cutoff=230):
    image = image.convert("L")
    arr = np.array(image, dtype=np.float32)
    h, w = arr.shape

    bayer8 = np.array([
        [ 0, 48, 12, 60,  3, 51, 15, 63],
        [32, 16, 44, 28, 35, 19, 47, 31],
        [ 8, 56,  4, 52, 11, 59,  7, 55],
        [40, 24, 36, 20, 43, 27, 39, 23],
        [ 2, 50, 14, 62,  1, 49, 13, 61],
        [34, 18, 46, 30, 33, 17, 45, 29],
        [10, 58,  6, 54,  9, 57,  5, 53],
        [42, 26, 38, 22, 41, 25, 37, 21],
    ], dtype=np.float32) / 64.0 * 42.5

    out = np.zeros_like(arr)
    for y in range(h):
        for x in range(w):
            pixel = arr[y, x]

            if pixel >= white_cutoff:
                out[y, x] = 255  # Force white
                continue

            threshold = bayer8[y % 8, x % 8]
            value = pixel + threshold - 21
            gray_level = min(max(int(value // 85), 0), 3)
            out[y, x] = gray_level * 85

    return Image.fromarray(out.astype(np.uint8), mode="L")

def stretch_contrast(image):
    min_val, max_val = image.getextrema()
    if max_val - min_val < 30:
        return image  # Avoid divide-by-zero for low contrast
    def scale(x):
        return int(255 * (x - min_val) / (max_val - min_val))
    return image.point(scale)

def reinforce_black_text(original_gray, dithered_image, threshold=60):
    orig_arr = np.array(original_gray.convert("L"), dtype=np.uint8)
    dith_arr = np.array(dithered_image, dtype=np.uint8)

    # Mask: where original image is very dark (likely text)
    text_mask = orig_arr < threshold

    # Force those pixels to pure black in the dithered image
    dith_arr[text_mask] = 0

    return Image.fromarray(dith_arr, mode="L")

def prepare_manga_page_crop_sides_only(img_path, target_size=(480, 800), brightness_cutoff=240):
    """
    Crop only the left and right white borders from a manga page,
    then scale to the target resolution, preserving top and bottom.
    """
    img = Image.open(img_path).convert("L")
    target_h = target_size

    img = img.resize((img.width, target_h), Image.LANCZOS)  # scale to screen height

    # Convert to binary mask for white detection
    mask = img.point(lambda x: 0 if x > brightness_cutoff else 255, mode="1")
    mask_data = mask.load()

    # Analyze columns from left and right
    left_crop = 0
    for x in range(img.width // 2):
        col = [mask_data[x, y] for y in range(img.height)]
        if sum(col) < img.height:  # found some dark pixels
            break
        left_crop += 1

    right_crop = 0
    for x in range(img.width - 1, img.width // 2, -1):
        col = [mask_data[x, y] for y in range(img.height)]
        if sum(col) < img.height:
            break
        right_crop += 1

    # Crop the image evenly from both sides
    crop_left = left_crop
    crop_right = img.width - right_crop
    img = img.crop((crop_left, 0, crop_right, img.height))

    # Resize to exact screen size
    img = img.resize(target_size, Image.LANCZOS)
    return img

def prepare_manga_page_crop_to_aspect(img_path, target_size=(480, 800), brightness_cutoff=240):
    """
    - Auto-crops all white borders.
    - Then center-crops left/right to match target aspect ratio (top/bottom preserved).
    - Then resizes to exact target resolution.
    """
    img = Image.open(img_path).convert("L")
    target_w, target_h = target_size
    target_aspect = target_w / target_h

    # --- Step 1: Auto-crop all white borders ---
    # Create binary mask: white = 0, black = 255
    mask = img.point(lambda x: 0 if x > brightness_cutoff else 255, mode='1')
    bbox = mask.getbbox()
    if not bbox:
        # If all white, return a blank canvas
        return Image.new("L", target_size, 255)
    img = img.crop(bbox)

    # --- Step 2: Crop sides to match aspect ratio ---
    # Preserve full height
    w, h = img.size
    current_aspect = w / h

    if current_aspect > target_aspect:
        # Too wide → crop sides
        new_w = int(target_aspect * h)
        crop_x = (w - new_w) // 2
        img = img.crop((crop_x, 0, crop_x + new_w, h))
        # (don't touch top/bottom)
    # Else if too narrow, do nothing (will be stretched slightly when resized)

    # --- Step 3: Resize to target ---
    img = img.resize(target_size, Image.LANCZOS)
    return img

def enhance_and_dither(img, levels=[0, 85, 170, 255]):
    """
    Preprocess and Floyd–Steinberg dither to 4-gray levels, optimized for fine-line manga.
    """
    # Convert to grayscale
    img = img.convert("L")

    # --- Preprocessing ---
    img = ImageOps.autocontrast(img, cutoff=2)  # stretch contrast, ignoring top/bottom 2%
    img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3))  # sharpen fine lines

    # --- Floyd–Steinberg dithering ---
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape
    quant_arr = np.zeros_like(arr)

    def find_nearest_level(val):
        # Map brighter values more aggressively to darker gray to preserve linework
        return min(levels, key=lambda x: abs(x - val))

    for y in range(h):
        for x in range(w):
            old_pixel = arr[y, x]
            new_pixel = find_nearest_level(old_pixel)
            quant_arr[y, x] = new_pixel
            error = old_pixel - new_pixel
            if x + 1 < w:
                arr[y, x + 1] += error * 7 / 16
            if x - 1 >= 0 and y + 1 < h:
                arr[y + 1, x - 1] += error * 3 / 16
            if y + 1 < h:
                arr[y + 1, x] += error * 5 / 16
            if x + 1 < w and y + 1 < h:
                arr[y + 1, x + 1] += error * 1 / 16

    result_img = Image.fromarray(np.clip(quant_arr, 0, 255).astype(np.uint8), mode="L")
    return result_img


def color_manga_to_eink_4gray(img, gray_levels=[0, 85, 170, 255]):
    """
    Converts a color manga page to a 4-level grayscale image optimized for e-ink.
    Uses smart luminance conversion, contrast stretching, and Floyd–Steinberg dithering.
    """
    # Step 1: Convert to grayscale using luminance-aware transform
    img = img.convert("L")  # PIL does this with ITU-R 601-2 luma transform

    # Step 2: Optional contrast enhancement
    img = ImageOps.autocontrast(img, cutoff=1)
    img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=100, threshold=3))

    # Step 3: Dither to 4 gray levels (Floyd–Steinberg)
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape
    out = np.zeros_like(arr)

    def quantize(val):
        return min(gray_levels, key=lambda g: abs(g - val))

    for y in range(h):
        for x in range(w):
            old = arr[y, x]
            new = quantize(old)
            out[y, x] = new
            err = old - new
            if x + 1 < w:
                arr[y, x + 1] += err * 7 / 16
            if x - 1 >= 0 and y + 1 < h:
                arr[y + 1, x - 1] += err * 3 / 16
            if y + 1 < h:
                arr[y + 1, x] += err * 5 / 16
            if x + 1 < w and y + 1 < h:
                arr[y + 1, x + 1] += err * 1 / 16

    result = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), mode="L")
    return result

def run():
    anime = [ 
        Anime('sakura', enhance_and_dither, '/home/mbutki/pi_projects/python/src/displays/eink_weather/images/sakura'),
        Anime('yotsuba', color_manga_to_eink_4gray, '/home/mbutki/pi_projects/python/src/displays/eink_weather/images/yotsuba'),
        Anime('chi', color_manga_to_eink_4gray, '/home/mbutki/pi_projects/python/src/displays/eink_weather/images/chi')
    ]

    epd = epd7in5_V2.EPD()
    now = datetime.now()

    # Drawing on the image
    SMALL_FONT_SIZE = 24
    LARGE_FONT_SIZE = 42
    IS_EVENING = now.hour >= 17
    IS_MORNING = now.hour <= 10
    DRAW_SMALL = not IS_MORNING
    font_size = SMALL_FONT_SIZE if DRAW_SMALL else LARGE_FONT_SIZE
    font = ImageFont.truetype(f'{PI_DIR}/python/src/displays/eink_weather/fonts/Helvetica.ttc', font_size)

    # Drawing on the Vertical image
    black_image = Image.new('L', (epd.height, epd.width), 255)
    draw_black = ImageDraw.Draw(black_image)
    img = random.choice(anime).get_rand_img()
    black_image.paste(img, (0, 0))

    data = fetchData()
    if data:
        weather = fetchData()

        today = weather['days'][sorted(weather['days'])[0]]
        tomorrow = weather['days'][sorted(weather['days'])[1]]
        day = tomorrow if IS_EVENING else today

        high = today['high']
        pop = today['pop']
        condition = day['condition']
        match condition:
            case 'light_cloud':
                condition = 'mixed'
            case 'medium_cloud':
                condition = 'mixed'
            case 'heavy_cloud':
                condition = 'cloud'
            case 'light_rain':
                condition = 'rain'
            case 'heavy_rain':
                condition = 'rain'
        '''
        'clear': [SUN],
        'light_cloud': [SUN, LIGHT_CLOUD],
        'medium_cloud': [SUN, MEDIUM_CLOUD],
        'heavy_cloud': [HEAVY_CLOUD],
        'light_rain': [LIGHT_RAIN],
        'heavy_rain': [HEAVY_RAIN],
        'thunder': [THUNDER],
        'atmo': [ATMO],
        'snow': [SNOW]
        '''
        condition = condition.upper()

        pos1 = (429, 20) if DRAW_SMALL else (410, 20)
        pos2 = (454, 20) if DRAW_SMALL else (445, 20)
        pos3 = (429, 75) if DRAW_SMALL else (410, 120)
        text1 = f'{high}'
        text2 = f'{condition}'
        text3 = f'{pop}'
        direction = 'ttb'

        bbox = draw_black.textbbox(pos1, text1, font = font, direction=direction)
        bbox = (bbox[0]-3, bbox[1]-3, bbox[2]+3, bbox[3]+1)
        draw_black.rectangle(bbox, fill = 255)
        draw_black.rectangle(bbox)
        draw_black.text(pos1, text1, font = font, fill = 0, direction=direction)

        bbox = draw_black.textbbox(pos2, text2, font = font, direction=direction)
        bbox = (bbox[0]-3, bbox[1]-3, bbox[2]+1, bbox[3]+1)
        draw_black.rectangle(bbox, fill = 255)
        draw_black.rectangle(bbox)
        draw_black.text(pos2, text2, font = font, fill = 0, direction=direction)

        if pop > 20:
            bbox = draw_black.textbbox(pos3, text3, font = font, direction=direction)
            bbox = (bbox[0]-3, bbox[1]-3, bbox[2]+1, bbox[3]+1)
            draw_black.rectangle(bbox, fill = 255)
            draw_black.rectangle(bbox)
            draw_black.text(pos3, text3, font = font, fill = 0, direction=direction)

    #clean_refresh(epd) # turn out not needed
    epd.init_4Gray()
    epd.display_4Gray(epd.getbuffer_4Gray(black_image))
    time.sleep(1) # hopefully fix random "out-of-ink" pages

    print("Goto Sleep...")
    epd.sleep()

if __name__ == '__main__':
    main()
