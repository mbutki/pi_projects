import os
import sys
import random
import subprocess
import time
import socket
import json

MPV_SOCKET = "/tmp/mpv-socket"

def get_gif_files(directory):
    return [os.path.join(directory, f) for f in os.listdir(directory)
            if f.lower().endswith('.gif') and os.path.isfile(os.path.join(directory, f))]

def send_command_to_mpv(command):
    try:
        client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        client.connect(MPV_SOCKET)
        client.sendall((json.dumps(command) + "\n").encode('utf-8'))
        client.close()
    except Exception as e:
        print(f"Error sending command to mpv: {e}")

def start_mpv():
	# Remove any stale socket
    if os.path.exists(MPV_SOCKET):
        try:
            os.remove(MPV_SOCKET)
        except Exception as e:
            print(f"Error removing old socket: {e}")
            sys.exit(1)

    mpv_proc = subprocess.Popen([
        "mpv",
        "--idle=yes",
        "--fs",
        "--loop-file=inf",
        "--no-terminal",
        #"--really-quiet",
        f"--input-ipc-server={MPV_SOCKET}",
        "--video-rotate=270"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	# Wait for the socket to become available
    for i in range(300):  # wait up to 30 seconds
        if os.path.exists(MPV_SOCKET):
            try:
                sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                sock.connect(MPV_SOCKET)
                sock.close()
                return mpv_proc
            except:
                pass
        time.sleep(0.1)
    # Read and decode stderr
    stderr_output = mpv_proc.stderr.read().decode()
    print("mpv stderr output:")
    print(stderr_output)

    print("Error: mpv socket did not become available.")
    mpv_proc.terminate()
    sys.exit(1)

def play_gif(file_path, duration):
    send_command_to_mpv({"command": ["loadfile", file_path, "replace"]})
    time.sleep(duration)

def main():
    if len(sys.argv) != 3:
        print("Usage: python play_gifs.py <directory_with_gifs> <seconds_per_gif>")
        sys.exit(1)

    gif_dir = sys.argv[1]
    try:
        loop_time = int(sys.argv[2])
        if loop_time <= 0:
            raise ValueError
    except ValueError:
        print("Error: <seconds_per_gif> must be a positive integer.")
        sys.exit(1)

    if not os.path.isdir(gif_dir):
        print(f"Error: '{gif_dir}' is not a valid directory.")
        sys.exit(1)

    gif_files = get_gif_files(gif_dir)
    if not gif_files:
        print(f"No GIFs found in directory: {gif_dir}")
        sys.exit(1)

    print(f"Starting fullscreen gif playback: {loop_time} seconds per GIF...")

    mpv_proc = start_mpv()

    try:
        while True:
            random.shuffle(gif_files)
            for gif in gif_files:
                play_gif(gif, loop_time)
    except KeyboardInterrupt:
        print("\nInterrupted by user. Exiting...")
    finally:
        print("Terminating mpv...")
        mpv_proc.terminate()
        mpv_proc.wait()
        if os.path.exists(MPV_SOCKET):
            os.remove(MPV_SOCKET)

if __name__ == "__main__":
    main()

