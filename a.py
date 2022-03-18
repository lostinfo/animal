import win32gui, win32ui, win32con, win32api
import time
import sys
import keyboard
from multiprocessing import Process
import pyautogui
from ctypes import *
import random

pyautogui.FAILSAFE = False

# 603
#config = {"width":603,"height":1116,"phone":{"x":530,"y":1030},"foods":[{"x":225,"y":446},{"x":375,"y":446},{"x":525,"y":446},{"x":225,"y":625},{"x":375,"y":625},{"x":525,"y":625}],"fishs":[{"x":98,"y":480},{"x":253,"y":527},{"x":373,"y":527},{"x":493,"y":527},{"x":253,"y":710},{"x":373,"y":710},{"x":493,"y":710},{"x":288,"y":842},{"x":273,"y":951}],"duck":{"x":455,"y":370},"no1":{"x":217,"y":720},"no2":{"x":178,"y":944},"no3":{"x":325,"y":545},"close1":{"x":560,"y":85},"confirm1":{"x":308,"y":745},"confirm2":{"x":440,"y":740}}
# 450
config = {"width":450,"height":844,"phone":{"x":405,"y":780},"foods":[{"x":170,"y":345},{"x":280,"y":345},{"x":390,"y":345},{"x":170,"y":475},{"x":280,"y":475},{"x":390,"y":475}],"fishs":[{"x":80,"y":370},{"x":185,"y":415},{"x":285,"y":415},{"x":385,"y":415},{"x":185,"y":545},{"x":285,"y":545},{"x":385,"y":545},{"x":215,"y":635},{"x":220,"y":715}],"duck":{"x":340,"y":290},"no1":{"x":163,"y":555},"no2":{"x":143,"y":719},"no3":{"x":250,"y":425},"close1":{"x":415,"y":75},"confirm1":{"x":235,"y":570},"confirm2":{"x":350,"y":560}}

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
    ori_width = config['width']
    ori_height = config['height']

    hwnd = get_hwnd()
    x, y, right, bottom = get_cordinates(hwnd)
    print("width, height: ", right - x, bottom - y)
    cur_width = right - x
    ratio = cur_width * 1.0 / ori_width
    return x, y, ratio

def special(x, y, ratio):
    spec_count = 1
    while True:
        # food
        for food in config['foods']:
            pyautogui.click(get_rand_point(x + food['x'] * ratio), get_rand_point(y + food['y'] * ratio))
            time.sleep(0.2)
        time.sleep(1)
        # fish
        for fish in config['fishs']:
            pyautogui.click(get_rand_point(x + fish['x'] * ratio), get_rand_point(y + fish['y'] * ratio))
            time.sleep(0.2)
        time.sleep(1)
        # duck
        if (spec_count % 50 == 0):
            for i in range(20):
                pyautogui.click(get_rand_point(x + config['duck']['x'] * ratio), get_rand_point(y + config['duck']['y'] * ratio))
            spec_count = 1
        time.sleep(0.2)
        # no1
        pyautogui.click(get_rand_point(x + config['no1']['x'] * ratio), get_rand_point(y + config['no1']['y'] * ratio))
        time.sleep(0.2)
        # no2
        pyautogui.click(get_rand_point(x + config['no2']['x'] * ratio), get_rand_point(y + config['no2']['y'] * ratio))
        time.sleep(0.2)
        # no3
        pyautogui.click(get_rand_point(x + config['no3']['x'] * ratio), get_rand_point(y + config['no3']['y'] * ratio))
        time.sleep(0.2)
        # close1
        pyautogui.click(get_rand_point(x + config['close1']['x'] * ratio), get_rand_point(y + config['close1']['y'] * ratio))
        time.sleep(0.2)
        # confirm1
        pyautogui.click(get_rand_point(x + config['confirm1']['x'] * ratio), get_rand_point(y + config['confirm1']['y'] * ratio))
        time.sleep(0.2)
        # confirm2
        pyautogui.click(get_rand_point(x + config['confirm2']['x'] * ratio), get_rand_point(y + config['confirm2']['y'] * ratio))
        time.sleep(0.2)
        spec_count += 1

def get_rand_point(num, len = 10):
    return num + random.randint(0, len)

def publicity(x, y, ratio):
    click_count = 1
    while True:
        pyautogui.click(get_rand_point(x + config['phone']['x'] * ratio, 30), get_rand_point(y + config['phone']['y'] * ratio, 30))
        time.sleep(0.2)
        click_count += 1
        if (click_count % 1000 == 0):
            time.sleep(40)
            click_count = 1

def quit():
    keyboard.record(until='escape')
    print('exiting program')

def main():
    x, y, ratio = get_pos()
    print('found animal restaurant windows')
    print('position: ', x, y, ratio)

    pool = []

    p = Process(target=special, args=(x, y, ratio, ))
    pool.append(p)

    for i in range(1):
        p = Process(target=publicity, args=(x + i, y + i, ratio, ))
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