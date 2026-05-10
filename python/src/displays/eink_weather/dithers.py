from PIL import Image, ImageFilter, ImageOps
import numpy as np


def enhance_and_dither(img, levels=[0, 85, 170, 255]):
    """
    Preprocess and Floyd–Steinberg dither to 4-gray levels, optimized for fine-line manga.
    """
    # Convert to grayscale
    img = img.convert("L")

    # --- Preprocessing ---
    img = ImageOps.autocontrast(
        img, cutoff=2
    )  # stretch contrast, ignoring top/bottom 2%
    img = img.filter(
        ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3)
    )  # sharpen fine lines

    # --- Floyd–Steinberg dithering ---
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape
    quant_arr = np.zeros_like(arr)

    # Optimization: Pre-calculate a lookup table for all 256 possible pixel values
    # This avoids calling min() and a lambda millions of times in a loop.
    lut = np.array(
        [min(levels, key=lambda x: abs(x - i)) for i in range(256)], dtype=np.float32
    )

    for y in range(h):
        for x in range(w):
            old_pixel = arr[y, x]
            new_pixel = lut[int(np.clip(old_pixel, 0, 255))]
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
