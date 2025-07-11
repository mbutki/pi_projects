sudo cp MCP9808.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl start MCP9808.service
sudo systemctl enable MCP9808.service


