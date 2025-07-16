sudo cp stray-rotate-0.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start stray-rotate-0.service
sudo systemctl enable stray-rotate-0.service