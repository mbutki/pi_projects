sudo cp mqtt_sql_bridge.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start mqtt_sql_bridge.service
sudo systemctl enable mqtt_sql_bridge.service


