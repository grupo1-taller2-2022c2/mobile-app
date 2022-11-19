#!/bin/sh

#if permission denied error run
#$ chmod +x signup_and_get_ready_for_trip.sh 
#only env is TOKEN

#signs up and creates trip request
#for swagger
#email driver@fake.com
#password 1234

#sign up
curl -s -X 'POST' \
  'http://localhost:3005/users/signup' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "driver@fake.com",
  "password": "1234",
  "username": "Fake",
  "surname": "Driver"
}' > signup_and_get_ready_for_trip_logs
echo "\n" >> signup_and_get_ready_for_trip_logs

#save login info
cat signup_and_get_ready_for_trip_logs > login_info_driver

#sign in
curl -s -X 'POST' \
  'http://localhost:3005/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=&username=driver%40fake.com&password=1234&scope=&client_id=&client_secret=' > token.txt
 
#makes token.txt file hold only the login token 
python3 parse_token.py 
sleep 1

#adds vehicle
curl -s -X 'POST' \
  'http://localhost:3005/drivers/vehicle' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkcml2ZXJAZmFrZS5jb20iLCJleHAiOjE2Njg4ODc0Nzd9.A8kURZkUzbuii_34k9YCuHuD-B-bb3axepALK2dpxuY' \
  -H 'Content-Type: application/json' \
  -d '{
  "licence_plate": "ABC-123",
  "model": "Peugeot 580"
}' >> LOGS-signup_and_get_ready_for_trip
echo "\n" >> LOGS-signup_and_get_ready_for_trip

#adds last location
curl -s -X 'POST' \
  'http://localhost:3005/drivers/last_location' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkcml2ZXJAZmFrZS5jb20iLCJleHAiOjE2Njg4ODc0Nzd9.A8kURZkUzbuii_34k9YCuHuD-B-bb3axepALK2dpxuY' \
  -H 'Content-Type: application/json' \
  -d '{
  "street_name": "Rivadavia",
  "street_num": 1700
}' >> LOGS-signup_and_get_ready_for_trip
echo "\n" >> LOGS-signup_and_get_ready_for_trip
  
  
#adds placeholder expo token
curl -s -X 'POST' \
  'http://localhost:3005/notifications/token/' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkcml2ZXJAZmFrZS5jb20iLCJleHAiOjE2Njg4ODc0Nzd9.A8kURZkUzbuii_34k9YCuHuD-B-bb3axepALK2dpxuY' \
  -H 'Content-Type: application/json' \
  -d '{
  "token": "string"
}' >> LOGS-signup_and_get_ready_for_trip
echo "\n" >> LOGS-signup_and_get_ready_for_trip
  
