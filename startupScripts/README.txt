# setting up a new startup script

sudo cp temperature /etc/init.d/
sudo update-rc.d temperature defaults
sudo service temperature start

# removing a startup script

sudo update-rc.d -f temperature remove
