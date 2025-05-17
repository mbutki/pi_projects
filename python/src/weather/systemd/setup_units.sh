sudo cp fetchWeather.service /etc/systemd/system/
sudo cp fetchWeather.timer /etc/systemd/system/
sudo systemctl start fetchWeather.timer
sudo systemctl enable fetchWeather.timer

sudo cp showWeather.service /etc/systemd/system/
sudo systemctl start showWeather.service
sudo systemctl enable showWeather.service

sudo systemctl daemon-reload
