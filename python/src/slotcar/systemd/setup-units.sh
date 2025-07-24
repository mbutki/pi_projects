sudo cp slotcar.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start slotcar.service
sudo systemctl enable slotcar.service