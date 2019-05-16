import RPi.GPIO as gpio
import time
import sys
import subprocess

displayOn = True
restartService = 'sudo service weatherDisplay restart'
stopService = 'sudo service weatherDisplay stop'

subprocess.call(restartService, shell = True)
