
sudo cp webserver.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start webserver.service
sudo systemctl enable webserver.service

# Use nmcli to disable wifi powersave on the connection profile.
# This is persistent and preferred over a custom systemd service.
sudo nmcli connection modify preconfigured wifi.powersave disable