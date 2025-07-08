sudo cp stray.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start stray.service
sudo systemctl enable stray.service


