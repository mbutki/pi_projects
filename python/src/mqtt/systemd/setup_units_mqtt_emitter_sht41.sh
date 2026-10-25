sudo cp mqtt_emitter_sht41.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start mqtt_emitter_sht41.service
sudo systemctl enable mqtt_emitter_sht41.service
