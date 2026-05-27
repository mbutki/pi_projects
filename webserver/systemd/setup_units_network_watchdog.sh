#!/bin/bash

sudo cp network_watchdog.service /etc/systemd/system/
sudo cp network_watchdog.timer /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable network_watchdog.timer
sudo systemctl start network_watchdog.timer
