import time
from datetime import datetime
import os
from PIL import Image
import mss
import numpy as np
from skimage.metrics import structural_similarity as ssim
import cv2
import sys
current_directory = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.dirname(current_directory)
sys.path.append(parent_directory)
from model.database_manager import DatabaseManager
db_manager = DatabaseManager()
from datetime import datetime, timedelta
prev_file_path = None
prev_end_date = None
import win32gui, win32process, psutil
import time

def active_window_process_name():
    try:
        pid = win32process.GetWindowThreadProcessId(win32gui.GetForegroundWindow())
        return psutil.Process(pid[-1]).name()
    except:
        pass

def compare_images(img1, img2):
    img1_gray = cv2.cvtColor(np.array(img1), cv2.COLOR_BGR2GRAY)
    img2_gray = cv2.cvtColor(np.array(img2), cv2.COLOR_BGR2GRAY)
    score, _ = ssim(img1_gray, img2_gray, full=True)
    return score

def capture_screenshot():
    with mss.mss() as sct:
        monitor = sct.monitors[1]
        screenshot = sct.grab(monitor)
        img = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
        return img

def save_screenshot(img):
    global prev_file_path, prev_end_date

    base_height = 720
    aspect_ratio = (base_height / float(img.size[1]))
    width = int((float(img.size[0]) * float(aspect_ratio)))
    img = img.resize((width, base_height), Image.LANCZOS)

    quality_setting = 80

    timestamp = int(datetime.now().timestamp())
    date_str = datetime.now().strftime("%m%d%Y")
    dir_path = os.path.join(current_directory,f"../data/screencapture/{date_str}")

    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

    file_path = os.path.join(dir_path, f"{timestamp}.webp")

    img.save(file_path, quality=quality_setting, format='WEBP')

    start_date = int((datetime.now() - timedelta(minutes=1)).timestamp())
    end_date = timestamp

    process_name = active_window_process_name()
    if process_name:
        process_name = process_name.replace('.exe', '')

    if prev_file_path:
        prev_img = Image.open(prev_file_path)
        similarity = compare_images(prev_img, img)

        if similarity >= 0.9:
            db_manager.update_screencapture(prev_end_date, f"{date_str}/{timestamp}.webp", end_date)
            os.remove(prev_file_path)
        else:
            db_manager.insert_screencapture(timestamp, f"{date_str}/{timestamp}.webp", start_date, end_date, process_name)

    prev_file_path = file_path
    prev_end_date = end_date

if __name__ == "__main__":
    while True:
        img = capture_screenshot()
        save_screenshot(img)
        time.sleep(60)
