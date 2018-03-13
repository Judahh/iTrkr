#!/bin/sh
nmcli connection edit con-name 'MOBILE' <<EOD
gsm
goto ipv4
set method auto
back
set connection.autoconnect TRUE
set connection.interface-name ttyUSB3
save
yes
quit
