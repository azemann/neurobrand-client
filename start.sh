#!/bin/bash
cd server
npm install
npm start &
cd ../client
npm install
npm run dev -- --host=0.0.0.0 --port=3000
