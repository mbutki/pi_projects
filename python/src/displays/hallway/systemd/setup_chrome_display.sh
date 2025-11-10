sudo cp chrome_display.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl enable chrome_display.service
sudo systemctl start chrome_display.service