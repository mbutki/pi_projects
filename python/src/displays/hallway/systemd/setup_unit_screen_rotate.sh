sudo cp rotate_screen.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl enable rotate_screen.service
sudo systemctl start rotate_screen.service