#!/bin/bash

DEST_PATH="/home/mbutki/pi_projects/"
SRC_PATH="/home/mbutki/pi_projects/"

PI_HOSTS=("pi-desk" "pi-weather" "pi-hyper" "pi-triangle" "pi-kateeink" "pi-quinneink" "pi-slotcar")

for HOST in "${PI_HOSTS[@]}"; do
    echo "Syncing to $HOST..."
    rsync -az --exclude-from='exclude-list.txt' --delete "$SRC_PATH" mbutki@$HOST:"$DEST_PATH"
done
