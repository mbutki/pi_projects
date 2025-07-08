import os
import sys
import random
import subprocess
import time
import socket
import json

MPV_SOCKET = "/tmp/mpv-socket"

def get_mp4_files(directory):
    return [os.path.join(directory, f) for f in os.listdir(directory)
            if f.lower().endswith('.mp4') and os.path.isfile(os.path.join(directory, f))]

def send_command_to_mpv(command):
    try:
        client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        client.connect(MPV_SOCKET)
        client.sendall((json.dumps(command) + "\n").encode('utf-8'))
        client.close()
    except Exception as e:
        print(f"Error sending command to mpv: {e}")

def start_mpv():
    subprocess.Popen([
        "mpv",
        "--idle=yes",
        "--fs",
        "--loop-file=inf",   # 🔁 Loop video internally
        "--no-terminal",
        "--really-quiet",
        "--input-ipc-server=" + MPV_SOCKET
    ])

    # Wait for socket to become available
    for _ in range(20):
        if os.path.exists(MPV_SOCKET):
            try:
                socket.socket(socket.AF_UNIX, socket.SOCK_STREAM).connect(MPV_SOCKET)
                return
            except:
                pass
        time.sleep(0.1)
    raise RuntimeError("mpv socket did not become available.")

def play_mp4(file_path, duration):
    send_command_to_mpv({"command": ["loadfile", file_path, "replace"]})
    time.sleep(duration)

def main():
    if len(sys.argv) != 3:
        print("Usage: python mp4-player.py <seconds_per_video> <parent_directory>")
        sys.exit(1)

    try:
        loop_time = int(sys.argv[1])
        if loop_time <= 0:
            raise ValueError
    except ValueError:
        print("Error: <seconds_per_video> must be a positive integer.")
        sys.exit(1)

    parent_dir = sys.argv[2]
    if not os.path.isdir(parent_dir):
        print(f"Error: '{parent_dir}' is not a valid directory.")
        sys.exit(1)

    subdirs = sorted([
        os.path.join(parent_dir, d)
        for d in os.listdir(parent_dir)
        if os.path.isdir(os.path.join(parent_dir, d))
    ])

    if not subdirs:
        print(f"No subdirectories found in '{parent_dir}'.")
        sys.exit(1)

    print(f"🎬 Starting playback from subdirectories in '{parent_dir}'...")

    start_mpv()

    while True:
        for subdir in subdirs:
            mp4_files = get_mp4_files(subdir)
            if not mp4_files:
                print(f"⚠️  No mp4 files found in {subdir}")
                continue

            print(f"\n▶ Now playing from: {subdir}")
            random.shuffle(mp4_files)
            for video in mp4_files:
                print(f"🎞️  {os.path.basename(video)}")
                play_mp4(video, loop_time)

if __name__ == "__main__":
    main()

