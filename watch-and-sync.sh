#!/bin/bash

SRC="/home/mbutki/pi_projects"
cd "$SRC" || {
    echo "ERROR: Could not cd to $SRC"
    exit 1
}

echo "[$(date)] [INFO] Watching: $SRC"
echo "[$(date)] [INFO] inotifywait path: $(command -v inotifywait)"
echo "[$(date)] [INFO] Current directory contents:"
find . -type d

# Monitor all subdirs recursively and log events
inotifywait -mr -e modify,create,delete,move . |
while read -r directory events filename; do
    echo "[$(date)] [EVENT] $events -> $directory$filename"
	/home/mbutki/pi_projects/sync-to-pis.sh
done

