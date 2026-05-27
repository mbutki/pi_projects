#!/bin/bash

# The IP of your router/gateway
GATEWAY="192.168.86.1"
# A reliable external target
EXTERNAL="8.8.8.8"

check_connection() {
    ping -c 1 -W 5 $GATEWAY > /dev/null 2>&1 || ping -c 1 -W 5 $EXTERNAL > /dev/null 2>&1
}

if ! check_connection; then
    echo "Network unreachable. Attempting interface reset..."
    
    # Try restarting the interface via NetworkManager
    sudo nmcli device disconnect wlan0
    sleep 2
    sudo nmcli device connect wlan0
    
    # Wait to see if it recovered
    sleep 20
    
    if ! check_connection; then
        echo "Interface reset failed. Hard rebooting..."
        sudo /sbin/reboot
    fi
else
    exit 0
fi
