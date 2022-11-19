#!/bin/sh

#if permission denied error run
#$ chmod +x signup_and_create_trip.sh 
#only env is TOKEN

#signs up and creates trip request
#for swagger
#email passenger@fake.com
#password 1234

#sign up
curl -s -X 'POST' \
  'http://localhost:3005/users/signup' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "passenger@fake.com",
  "password": "1234",
  "username": "Fake",
  "surname": "Passenger"
}' > LOGS-signup_and_create_trip
echo "\n" >> LOGS-signup_and_create_trip

#save login info
cat LOGS-signup_and_create_trip > login_info_passenger

#sign in
curl -s -X 'POST' \
  'http://localhost:3005/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=&username=passenger%40fake.com&password=1234&scope=&client_id=&client_secret=' > token.txt
 
 #makes token.txt file hold only the login token 
python3 parse_token.py 
sleep 1

#request for trip
curl -s -X 'POST' \
  'http://localhost:3005/trips/' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwYXNzZW5nZXJAZmFrZS5jb20iLCJleHAiOjE2Njg4ODY3ODJ9.6AWJl-RI27nHpAXgzCbaJkxDFRBVHRUpCYf8Yx7TqOU' \
  -H 'Content-Type: application/json' \
  -d '{
  "src_address": "Rivadavia",
  "src_number": 1500,
  "dst_address": "Rivadavia",
  "dst_number": 1700,
  "duration": 10,
  "distance": 10,
  "trip_type": "string"
}
' >> LOGS-signup_and_create_trip

  

