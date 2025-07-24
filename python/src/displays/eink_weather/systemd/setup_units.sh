sudo cp eink_weather_manga.service /etc/systemd/system/
sudo cp eink_weather_manga.timer /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start eink_weather_manga.timer
sudo systemctl enable eink_weather_manga.timer


