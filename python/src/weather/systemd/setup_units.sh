sudo cp fetch_weather.service /etc/systemd/system/
sudo cp fetch_weather.timer /etc/systemd/system/
sudo cp show_weather.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start fetch_weather.timer
sudo systemctl enable fetch_weather.timer
sudo systemctl start show_weather.service
sudo systemctl enable show_weather.service


