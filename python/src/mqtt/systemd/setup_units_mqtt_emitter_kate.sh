sudo cp mqtt_emitter_kate.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start mqtt_emitter_kate.service
sudo systemctl enable mqtt_emitter_kate.service


