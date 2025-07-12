sudo cp fcserver.service /etc/systemd/system/
sudo cp triangle.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl restart fcserver.service
sudo systemctl enable fcserver.service

sudo systemctl restart triangle.service
sudo systemctl enable triangle.service
