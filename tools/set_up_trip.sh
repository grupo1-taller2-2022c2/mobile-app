#!/bin/sh

#if permission denied error run
#$ chmod +x set_up_trip.sh 
#only env is TOKEN

echo "Will create driver and passenger users, and make the passenger request a trip. Logs are available on the respective folders\n"

cd driver/
./signup_and_get_ready_for_trip.sh
cat login_info_driver
cd ..
cd passenger/
./signup_and_create_trip.sh
cat login_info_passenger

echo "Password for both is 1234"
