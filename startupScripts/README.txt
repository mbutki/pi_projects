# setting up a new startup script

chmod 755 temperature
sudo cp temperature /etc/init.d/
sudo update-rc.d temperature defaults
sudo service temperature start

# removing a startup script

sudo update-rc.d -f temperature remove
