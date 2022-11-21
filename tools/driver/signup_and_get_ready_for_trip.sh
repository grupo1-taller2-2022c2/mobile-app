#!/bin/sh

#if permission denied error run
#$ chmod +x signup_and_get_ready_for_trip.sh 

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
}' > logs
echo "\n" >> logs

#save login info
cat logs > login_info_driver

#sign in
curl -s -X 'POST' \
  'http://localhost:3005/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=&username=driver%40fake.com&password=1234&scope=&client_id=&client_secret=' > token.txt
 
#makes token.txt file hold only the login token 
python3 parse_token.py 
sleep 1

token_value=`cat token.txt`
auth="Authorization: Bearer ${token_value}"

#adds vehicle
curl -s -X 'POST' \
  'http://localhost:3005/drivers/vehicle' \
  -H 'accept: application/json' \
  -H "$auth" \
  -H 'Content-Type: application/json' \
  -d '{
  "licence_plate": "ABC-123",
  "model": "Peugeot 580"
}' >> logs
echo "\n" >> logs

#adds last location
curl -s -X 'POST' \
  'http://localhost:3005/drivers/last_location' \
  -H 'accept: application/json' \
  -H "$auth" \
  -H 'Content-Type: application/json' \
  -d '{
  "street_name": "Rivadavia",
  "street_num": 1700
}' >> logs
echo "\n" >> logs
  
  
#adds placeholder expo token
curl -s -X 'POST' \
  'http://localhost:3005/notifications/token/' \
  -H 'accept: application/json' \
  -H "$auth" \
  -H 'Content-Type: application/json' \
  -d '{
  "token": "string"
}' >> logs
echo "\n" >> logs
  
