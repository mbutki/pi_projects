#!/bin/bash

cd "$(dirname "$0")" || exit 1

DEST_PATH="/home/mbutki/pi_projects/"
SRC_PATH="/home/mbutki/pi_projects/"

PI_HOSTS=("pi-desk" "pi-weather" "pi-hyper" "pi-triangle" "pi-kateeink" "pi-quinneink" "pi-slotcar" "pi-hallway" "pi-backyard")

sync_to_host() {
    local host=$1
    local log
    log=$(mktemp)

    echo "Starting sync to $host..."
    if rsync -az --exclude-from='exclude-list.txt' --delete "$SRC_PATH" mbutki@"$host":"$DEST_PATH" >"$log" 2>&1; then
        echo "✓ $host: Successfully synced"
        rm -f "$log"
        return 0
    else
        echo "✗ $host: rsync failed"
        cat "$log"
        rm -f "$log"
        return 1
    fi
}

echo "Starting parallel sync to ${#PI_HOSTS[@]} hosts..."
echo "Source: $SRC_PATH"
echo "Destination: $DEST_PATH"
echo "--------------------------------------------------"

pids=()
hosts_by_pid=()
for HOST in "${PI_HOSTS[@]}"; do
    sync_to_host "$HOST" &
    pids+=($!)
    hosts_by_pid+=("$HOST")
done

successful_syncs=()
failed_syncs=()
for i in "${!pids[@]}"; do
    if wait "${pids[$i]}"; then
        successful_syncs+=("${hosts_by_pid[$i]}")
    else
        failed_syncs+=("${hosts_by_pid[$i]}")
    fi
done

echo "--------------------------------------------------"
echo "Sync completed!"
echo "Successful: ${#successful_syncs[@]}/${#PI_HOSTS[@]}"

if ((${#successful_syncs[@]} > 0)); then
    echo "✓ Success: ${successful_syncs[*]}"
fi

if ((${#failed_syncs[@]} > 0)); then
    echo "✗ Failed: ${failed_syncs[*]}"
    exit 1
fi

echo "All syncs completed successfully!"
