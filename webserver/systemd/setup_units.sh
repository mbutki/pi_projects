
sudo cp webserver.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start webserver.service
sudo systemctl enable webserver.service