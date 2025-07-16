sudo cp play-gifs-rotate-270.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start play-gifs-rotate-270.service
sudo systemctl enable play-gifs-rotate-270.service