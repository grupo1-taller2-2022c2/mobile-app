FROM node:16.18.0-buster-slim

WORKDIR /app

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm --allow-root -g npm@latest expo-cli@latest

COPY ./package.json ./package-lock.json /app/
RUN npm install

# copy in our source code last, as it changes the most
COPY . /app/

CMD expo start --web --clear