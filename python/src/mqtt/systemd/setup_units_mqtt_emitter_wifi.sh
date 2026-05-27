sudo cp mqtt_emitter_wifi.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start mqtt_emitter_wifi.service
sudo systemctl enable mqtt_emitter_wifi.service


