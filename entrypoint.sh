#!/bin/bash
echo $REACT_APP_API_GATEWAY_HOST
nohup ./launch_ngrok.sh > /dev/null 2>&1 &
REACT_APP_API_GATEWAY_HOST=$REACT_APP_API_GATEWAY_HOST expo start --tunnel --web
# REACT_APP_API_GATEWAY_HOST=$REACT_APP_API_GATEWAY_HOST expo start --web