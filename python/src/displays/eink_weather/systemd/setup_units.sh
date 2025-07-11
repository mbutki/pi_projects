sudo cp eink-weather-manga.service /etc/systemd/system/
sudo cp eink-weather-manga.timer /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start eink-weather-manga.timer
sudo systemctl enable eink-weather-manga.timer


