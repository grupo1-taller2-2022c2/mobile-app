#!/bin/sh

#if permission denied error run
#$ chmod +x reset_db.sh 
#only env is TOKEN

curl -X 'DELETE' \
  'http://localhost:3005/reset_db' \
  -H 'accept: application/json'
echo "\n"
