sudo cp play-gifs.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start play-gifs.service
sudo systemctl enable play-gifs.service