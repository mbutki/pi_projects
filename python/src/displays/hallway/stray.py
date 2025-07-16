import os
import sys
import random
import subprocess
import time
import socket
import json
import threading
import signal
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

MPV_SOCKET = "/tmp/mpv-socket"

class GifPlayerService:
    def __init__(self, gif_dir, loop_time, rotation):
        self.gif_dir = gif_dir
        self.loop_time = loop_time
        self.rotation = rotation
        self.running = True
        self.mpv_proc = None
        self.cleanup_done = False
        
    def signal_handler(self, signum, frame):
        """Handle termination signals from systemctl"""
        signal_name = signal.Signals(signum).name
        logger.info(f"Received {signal_name} signal")
        
        if signum in (signal.SIGTERM, signal.SIGINT):
            logger.info("Initiating graceful shutdown...")
            self.running = False
            
    def cleanup(self):
        """Perform cleanup operations"""
        if self.cleanup_done:
            return
            
        logger.info("Starting cleanup process...")
        
        try:
            # Stop mpv process
            if self.mpv_proc:
                logger.info("Terminating mpv process...")
                self.mpv_proc.terminate()
                
                # Wait for mpv to terminate gracefully
                try:
                    self.mpv_proc.wait(timeout=5)
                    logger.info("mpv terminated gracefully")
                except subprocess.TimeoutExpired:
                    logger.warning("mpv didn't terminate gracefully, killing...")
                    self.mpv_proc.kill()
                    self.mpv_proc.wait()
                    
            # Remove socket file
            if os.path.exists(MPV_SOCKET):
                logger.info("Removing mpv socket...")
                os.remove(MPV_SOCKET)
                
            logger.info("Cleanup completed successfully")
            
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
        finally:
            self.cleanup_done = True

    def get_gif_files(self, directory):
        return [os.path.join(directory, f) for f in os.listdir(directory)
                if os.path.isfile(os.path.join(directory, f))]

    def send_command_to_mpv(self, command):
        try:
            client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            client.connect(MPV_SOCKET)
            client.sendall((json.dumps(command) + "\n").encode('utf-8'))
            client.close()
        except Exception as e:
            logger.error(f"Error sending command to mpv: {e}")

    def start_mpv(self):
        # Remove any stale socket
        if os.path.exists(MPV_SOCKET):
            try:
                os.remove(MPV_SOCKET)
            except Exception as e:
                logger.error(f"Error removing old socket: {e}")
                sys.exit(1)

        mpv_proc = subprocess.Popen([
            "mpv",
            "--idle=yes",
            "--fs",
            "--loop-file=inf",
            "--no-terminal",
            #"--really-quiet",
            f"--input-ipc-server={MPV_SOCKET}",
            f"--video-rotate={self.rotation}",
            '--msg-level=all=trace'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logger.info(f"Started mpv with command: {' '.join(mpv_proc.args)}")

        def log_stderr(stream):
            for line in iter(stream.readline, b''):
                logger.info(f"[mpv] {line.decode().strip()}")

        # After starting mpv_proc:
        threading.Thread(target=log_stderr, args=(mpv_proc.stderr,), daemon=True).start()

        logger.info('Waiting for mpv socket to become available...')
        # Wait for the socket to become available
        for i in range(300):  # wait up to 30 seconds
            if not self.running:  # Check if we should stop
                mpv_proc.terminate()
                return None
                
            if os.path.exists(MPV_SOCKET):
                time.sleep(0.1)  # give mpv time to bind
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
        logger.error("mpv stderr output:")
        logger.error(stderr_output)

        logger.error("Error: mpv socket did not become available.")
        mpv_proc.terminate()
        sys.exit(1)

    def play_gif(self, file_path, duration):
        self.send_command_to_mpv({"command": ["loadfile", file_path, "replace"]})
        
        # Sleep in small chunks to allow for responsive shutdown
        slept = 0
        while slept < duration and self.running:
            sleep_time = min(0.1, duration - slept)
            time.sleep(sleep_time)
            slept += sleep_time

    def run(self):
        """Main service loop"""
        # Register signal handlers
        signal.signal(signal.SIGTERM, self.signal_handler)  # systemctl stop
        signal.signal(signal.SIGINT, self.signal_handler)   # Ctrl+C
        
        logger.info("GIF Player Service starting...")
        
        if not os.path.isdir(self.gif_dir):
            print(f"Error: '{self.gif_dir}' is not a valid directory.")
            sys.exit(1)

        subdirs = sorted([
            os.path.join((self.gif_dir), d)
            for d in os.listdir(self.gif_dir)
            if os.path.isdir(os.path.join(self.gif_dir, d))])

        if not subdirs:
            print(f"No subdirectories found in '{self.gif_dir}'.")
            sys.exit(1)

        logger.info(f"Starting fullscreen gif playback: {self.loop_time} seconds per GIF...")

        try:
            self.mpv_proc = self.start_mpv()
            if not self.mpv_proc:
                return  # mpv failed to start or we got shutdown signal
            
            while self.running:
                '''
                random.shuffle(gif_files)
                for gif in gif_files:
                    if not self.running:
                        break
                    logger.info(f"Playing: {os.path.basename(gif)}")
                    self.play_gif(gif, self.loop_time)
                '''
                for subdir in subdirs:
                    if not self.running:
                        break
                    mp4_files = self.get_gif_files(subdir)
                    if not mp4_files:
                        print(f"⚠️  No mp4 files found in {subdir}")
                        continue

                    print(f"\n▶ Now playing from: {subdir}")
                    random.shuffle(mp4_files)
                    for video in mp4_files:
                        print(f"🎞️  {os.path.basename(video)}")
                        self.play_gif(video, self.loop_time)
                if not self.running:
                    break
                    
        except Exception as e:
            logger.error(f"Error in main loop: {e}")
        finally:
            self.cleanup()
            logger.info("GIF Player Service stopped")

def main():
    if len(sys.argv) != 4:
        print("Usage: python play_gifs.py <directory_with_gifs> <seconds_per_gif> <rotation>")
        sys.exit(1)

    gif_dir = sys.argv[1]
    try:
        loop_time = int(sys.argv[2])
        if loop_time <= 0:
            raise ValueError
    except ValueError:
        print("Error: <seconds_per_gif> must be a positive integer.")
        sys.exit(1)
    rotation = sys.argv[3]

    # Create and run the service
    service = GifPlayerService(gif_dir, loop_time, rotation)
    service.run()

if __name__ == "__main__":
    main()
