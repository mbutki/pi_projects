sudo cp SHT31-D_read_temp_humid_NOW.service /etc/systemd/system/
sudo cp SHT31-D_read_temp_humid_NOW.timer /etc/systemd/system/

sudo cp SHT31-D_read_temp_humid.service /etc/systemd/system/
sudo cp SHT31-D_read_temp_humid.timer /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl restart SHT31-D_read_temp_humid_NOW.timer
sudo systemctl enable SHT31-D_read_temp_humid_NOW.timer

sudo systemctl restart SHT31-D_read_temp_humid.timer
sudo systemctl enable SHT31-D_read_temp_humid.timer