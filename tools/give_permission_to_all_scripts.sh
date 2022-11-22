#!/bin/sh

#if permission denied error run
#$ chmod +x reset_db.sh 
#only env is TOKEN

chmod +x reset_db.sh 
chmod +x set_up_trip.sh 
cd passenger/
chmod +x signup_and_create_trip.sh
cd ..
cd driver/
chmod +x signup_and_get_ready_for_trip.sh 
cd ..
