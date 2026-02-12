import time
from datetime import datetime
import json
import argparse
import random
import os

from typing import Any, Callable
from PIL import Image, ImageDraw, ImageFont
import mariadb

from displays.eink_weather.dithers import enhance_and_dither, color_manga_to_eink_4gray
import displays.eink_weather.epd7in5_V2 as epd7in5_V2
from weather import db_reads
from global_types import DbConfig


PI_DIR = "/home/mbutki/pi_projects"

db_config: DbConfig = json.load(open(f"{PI_DIR}/db.config"))

parser = argparse.ArgumentParser(description="Read motion sensors and trigger alert")
parser.add_argument("-v", default=False, action="store_true", help="verbose mode")
args = parser.parse_args()


def main() -> None:
    try:
        run()
    except IOError as e:
        print(e)
    except KeyboardInterrupt:
        print("ctrl + c:")
        exit()


def run():
    anime = [
        Anime(
            "sakura",
            enhance_and_dither,
            "/home/mbutki/pi_projects/python/src/displays/eink_weather/images/sakura",
        ),
        Anime(
            "yotsuba",
            color_manga_to_eink_4gray,
            "/home/mbutki/pi_projects/python/src/displays/eink_weather/images/yotsuba",
        ),
        Anime(
            "chi",
            color_manga_to_eink_4gray,
            "/home/mbutki/pi_projects/python/src/displays/eink_weather/images/chi",
        ),
        Anime(
            "pokemon",
            color_manga_to_eink_4gray,
            "/home/mbutki/pi_projects/python/src/displays/eink_weather/images/pokemon",
        ),
    ]

    epd = epd7in5_V2.EPD()

    black_image = Image.new("L", (epd.height, epd.width), 255)
    draw_black = ImageDraw.Draw(black_image)
    img = random.choice(anime).get_rand_img()
    black_image.paste(img, (0, 0))

    weather = fetch_data()
    draw_weather(weather, draw_black)

    # clean_refresh(epd) # turn out not needed
    epd.init_4Gray()
    epd.display_4Gray(epd.getbuffer_4Gray(black_image))
    time.sleep(1)  # hopefully fix random "out-of-ink" pages

    print("Goto Sleep...")
    epd.sleep()


def draw_weather(weather, draw_black: ImageDraw.ImageDraw) -> None:
    now = datetime.now()

    SMALL_FONT_SIZE = 42
    LARGE_FONT_SIZE = 96

    font_small = ImageFont.truetype(
        f"{PI_DIR}/python/src/displays/eink_weather/fonts/Helvetica.ttc",
        SMALL_FONT_SIZE,
    )
    font_large = ImageFont.truetype(
        f"{PI_DIR}/python/src/displays/eink_weather/fonts/Helvetica.ttc",
        LARGE_FONT_SIZE,
    )

    IS_EVENING = now.hour >= 17
    IS_MORNING = now.hour <= 10

    today = weather["days"][sorted(weather["days"])[0]]
    tomorrow = weather["days"][sorted(weather["days"])[1]]
    day = tomorrow if IS_EVENING else today

    high = today["high"]
    pop = today["pop"]
    condition = day["condition"]
    match condition:
        case "light_cloud":
            condition = "mixed"
        case "medium_cloud":
            condition = "mixed"
        case "heavy_cloud":
            condition = "cloud"
        case "light_rain":
            condition = "rain"
        case "heavy_rain":
            condition = "rain"

    # pylint: disable=pointless-string-statement
    """
    'clear': [SUN],
    'light_cloud': [SUN, LIGHT_CLOUD],
    'medium_cloud': [SUN, MEDIUM_CLOUD],
    'heavy_cloud': [HEAVY_CLOUD],
    'light_rain': [LIGHT_RAIN],
    'heavy_rain': [HEAVY_RAIN],
    'thunder': [THUNDER],
    'atmo': [ATMO],
    'snow': [SNOW]
    """

    if IS_MORNING:
        draw_morning(high, condition, pop, draw_black, font_large)
    else:
        draw_regular(high, condition, pop, draw_black, font_small)


def draw_morning(
    high: int,
    condition: str,
    pop: int,
    draw_black: ImageDraw.ImageDraw,
    font: ImageFont.FreeTypeFont,
) -> None:
    pos1 = (50, 50)
    pos2 = (50, 150)
    pos3 = (50, 250)
    text1 = f"{high}°"
    text2 = f"{condition.upper()}"
    text3 = f"{pop}%"

    bbox_top = draw_black.textbbox(pos1, text1, font=font)
    left = bbox_top[0]
    up = bbox_top[1]
    right = bbox_top[2]

    bbox_bottom = draw_black.textbbox(pos2, text2, font=font)
    right = max(right, bbox_bottom[2])
    down = bbox_bottom[3]

    if pop > 20:
        bbox_bottom = draw_black.textbbox(pos3, text3, font=font)
        right = max(right, bbox_bottom[2])
        down = bbox_bottom[3]

    bbox = (left - 25, up - 25, right + 25, down + 25)
    draw_black.rectangle(bbox, fill=255)
    draw_black.rectangle(bbox)

    draw_black.text(pos1, text1, font=font, fill=0)
    draw_black.text(pos2, text2, font=font, fill=0)
    if pop > 20:
        draw_black.text(pos3, text3, font=font, fill=0)


def draw_regular(
    high: int,
    condition: str,
    pop: int,
    draw_black: ImageDraw.ImageDraw,
    font: ImageFont.FreeTypeFont,
) -> None:
    pos1 = (410, 20)
    pos2 = (445, 20)
    pos3 = (410, 120)
    text1 = f"{high}"
    text2 = f"{condition.upper()}"
    text3 = f"{pop}"
    direction = "ttb"

    bbox = draw_black.textbbox(pos1, text1, font=font, direction=direction)
    bbox = (bbox[0] - 3, bbox[1] - 3, bbox[2] + 3, bbox[3] + 1)
    draw_black.rectangle(bbox, fill=255)
    draw_black.rectangle(bbox)
    draw_black.text(pos1, text1, font=font, fill=0, direction=direction)

    bbox = draw_black.textbbox(pos2, text2, font=font, direction=direction)
    bbox = (bbox[0] - 3, bbox[1] - 3, bbox[2] + 1, bbox[3] + 1)
    draw_black.rectangle(bbox, fill=255)
    draw_black.rectangle(bbox)
    draw_black.text(pos2, text2, font=font, fill=0, direction=direction)

    if pop > 20:
        bbox = draw_black.textbbox(pos3, text3, font=font, direction=direction)
        bbox = (bbox[0] - 3, bbox[1] - 3, bbox[2] + 1, bbox[3] + 1)
        draw_black.rectangle(bbox, fill=255)
        draw_black.rectangle(bbox)
        draw_black.text(pos3, text3, font=font, fill=0, direction=direction)


class Anime:
    def __init__(
        self,
        name: str,
        dither: Callable[[Image.Image], Image.Image],
        dir_name: str,
    ) -> None:
        self.name = name
        self.dither = dither
        self.dir_path = os.path.abspath(dir_name)
        self.filenames = [
            os.path.join(self.dir_path, f)
            for f in os.listdir(self.dir_path)
            if os.path.isfile(os.path.join(self.dir_path, f))
        ]

    def get_rand_img(self) -> Image.Image:
        filename = random.choice(self.filenames)
        img = prepare_manga_page_crop_to_aspect(filename)
        img = stretch_contrast(img)
        img = self.dither(img)
        return img


def fetch_data() -> Any | None:
    weather = None
    conn = None

    try:
        if args.v:
            print("Opening DB...")
        conn = mariadb.connect(user="mbutki", host="pi-desk", database="pidata")

        conn.autocommit = True
        if args.v:
            print("Get Cursor")
        cur = conn.cursor()

        weather = db_reads.fetch_weather(cur, args)

        conn.commit()
        conn.close()

        if args.v:
            print("DB client closed")
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return None

    return weather


def clean_refresh(epd: epd7in5_V2.EPD) -> None:
    """Flushes the screen with white, resets ghosting, and re-initializes grayscale mode."""
    epd.init_4Gray()
    epd.Clear()

    blank = Image.new("L", (epd.height, epd.width), 255)
    epd.display_4Gray(epd.getbuffer_4Gray(blank))

    time.sleep(1)
    epd.sleep()

    # Wake again in 4-gray mode
    epd.init_4Gray()


def stretch_contrast(image: Image.Image) -> Image.Image:
    extrema = image.getextrema()
    # For single-band images (like 'L'), getextrema() returns (min, max)
    # For multi-band, it returns ((min, max), (min, max), ...)
    if isinstance(extrema[0], tuple):
        # Multi-band image - take the first band as reference
        min_val = float(extrema[0][0])
        max_val = float(extrema[0][1])
    else:
        # Single-band image
        min_val = float(extrema[0])
        max_val = float(extrema[1])  # type: ignore

    if max_val - min_val < 30:
        return image  # Avoid divide-by-zero for low contrast

    def scale(x):
        return int(255 * (x - min_val) / (max_val - min_val))

    return image.point(scale)


def prepare_manga_page_crop_sides_only(
    img_path: str,
    target_size: tuple[int, int] = (480, 800),
    brightness_cutoff: int = 240,
) -> Image.Image:
    """
    Crop only the left and right white borders from a manga page,
    then scale to the target resolution, preserving top and bottom.
    """
    img = Image.open(img_path).convert("L")
    target_h = target_size[1]

    img = img.resize(
        (img.width, target_h), Image.Resampling.LANCZOS
    )  # scale to screen height

    # Convert to binary mask for white detection
    def threshold_func(pixel_value: int | float) -> int:
        return 0 if pixel_value > brightness_cutoff else 255

    mask = img.point(threshold_func).convert("1")
    mask_data = mask.load()

    if mask_data is None:
        # If mask data cannot be loaded, return the resized image as-is
        return img.resize(target_size, Image.Resampling.LANCZOS)

    # Analyze columns from left and right
    left_crop = 0
    for x in range(img.width // 2):
        col = []
        for y in range(img.height):
            pixel = mask_data[x, y]
            if isinstance(pixel, (int, float)):
                col.append(int(pixel))
            elif isinstance(pixel, tuple):
                col.append(int(pixel[0]) if pixel else 0)
            else:
                col.append(0)
        if sum(col) < img.height:  # found some dark pixels
            break
        left_crop += 1

    right_crop = 0
    for x in range(img.width - 1, img.width // 2, -1):
        col = []
        for y in range(img.height):
            pixel = mask_data[x, y]
            if isinstance(pixel, (int, float)):
                col.append(int(pixel))
            elif isinstance(pixel, tuple):
                col.append(int(pixel[0]) if pixel else 0)
            else:
                col.append(0)
        if sum(col) < img.height:
            break
        right_crop += 1

    # Crop the image evenly from both sides
    crop_left = left_crop
    crop_right = img.width - right_crop
    img = img.crop((crop_left, 0, crop_right, img.height))

    # Resize to exact screen size
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    return img


def prepare_manga_page_crop_to_aspect(
    img_path: str,
    target_size: tuple[int, int] = (480, 800),
    brightness_cutoff: int = 240,
) -> Image.Image:
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
    def threshold_func(pixel_value: int | float) -> int:
        return 0 if pixel_value > brightness_cutoff else 255

    mask = img.point(threshold_func).convert("1")
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
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    return img


if __name__ == "__main__":
    main()
