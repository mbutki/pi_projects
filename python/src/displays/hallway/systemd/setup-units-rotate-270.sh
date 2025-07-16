sudo cp stray-rotate-270.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start stray-rotate-270.service
sudo systemctl enable stray-rotate-270.service