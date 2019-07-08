# 1) sudo vim /boot/cmdline.txt
#     - add "isolcpus=3" to existing line
# 2)
sudo taskset -cp 3 453
