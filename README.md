# mobile-app

To run this first install the npm dependancies:

`npm install`

If you want to run web mode then install the following dependancies:

`npx expo install react-native-web@~0.18.7 react-dom@18.0.0 @expo/webpack-config@^0.17.0`

Make sure you are using React version 14 or higher.

To run this app simply run the following command:

`GATEWAY_URL=http://<your computer's IP>:3005 npm start`

If it doesnt work for any reason, try using a tunnel:
`ngrok http 3000`
`expo start --tunnel`

## Building the .apk

First of all, we need to make sure we are using a version of npm > 14 (in this project we use v18.12.1)

Then, just run 
```eas build -p android --profile production```
