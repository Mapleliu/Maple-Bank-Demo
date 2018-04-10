#!/bin/bash

sed -i "s/{API_SERVER_IP}/${API_SERVER_IP}/g" proxy.conf.js src/environments/environment.ts src/environments/environment.prod.ts
sed -i "s/{API_SERVER_PORT}/${API_SERVER_PORT}/g" proxy.conf.js src/environments/environment.ts src/environments/environment.prod.ts

npm start
