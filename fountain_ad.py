import win32gui, win32ui, win32con, win32api
import time
import sys
import keyboard
from multiprocessing import Process
import pyautogui
from ctypes import *
import random

pyautogui.FAILSAFE = False

def get_hwnd():
    hwnd = win32gui.FindWindow(None, '动物餐厅')
    if hwnd:
        return hwnd
    else:
        print('no program found!\nexiting in 5 seconds')
        time.sleep(5)
        sys.exit()

def get_cordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    return left, top, right, bottom

def get_pos():
    ori_width = 450
    ori_height = 844

    hwnd = get_hwnd()
    x, y, right, bottom = get_cordinates(hwnd)
    print("width, height: ", right - x, bottom - y)
    cur_width = right - x
    ratio = cur_width * 1.0 / ori_width
    return x, y, ratio

def fish_ad(x, y, ratio):
    spec_count = 1
    while True:
        pyautogui.click(x + 230 * ratio, y + 620 * ratio)
        time.sleep(5)
        pyautogui.click(x + 230 * ratio, y + 550 * ratio)
        time.sleep(35)
        pyautogui.click(x + 410 * ratio, y + 75 * ratio)
        time.sleep(35)

def quit():
    keyboard.record(until='escape')
    print('exiting program')

def main():
    x, y, ratio = get_pos()
    print('found animal restaurant windows')
    print('position: ', x, y, ratio)

    pool = []

    p = Process(target=fish_ad, args=(x, y, ratio, ))
    pool.append(p)

    for p in pool:
        p.start()

    p = Process(target=quit)
    p.start()

    print('program is running, click ESC to quit')

    p.join()

    for p in pool:
        p.terminate()

    print('all processes are terminated, exiting in 5 seconds')
    time.sleep(5)


if __name__ == '__main__':
    main()