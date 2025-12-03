# Cleanliness‑server 🧹

Backend REST API server for Cleanliness project — built with **Node.js**, **Express**, **MongoDB** (via Mongoose).  

 # 🚀 Live Demo

## Frontend Live:
https://kaleidoscopic-alpaca-0f5158.netlify.app/

## 🔗 Repositories
🖥️ Frontend Repo

https://github.com/Shoybit/Cleanliness--client?tab=readme-ov-file

## ⚙️ Backend Repo

https://github.com/Shoybit/Cleanliness-server

## 🔧 Tech Stack & Dependencies

This server uses:

- **Express.js** — for building HTTP REST API. :contentReference[oaicite:1]{index=1}  
- **Mongoose (v9.0.0)** — for MongoDB object‑modeling / schema definition & DB operations.  
- **dotenv** — for environment variable handling (`.env` config).  
- **cors** — to allow cross‑origin requests (useful if frontend is on different domain).  
- **nodemon** (dev dependency) — auto‑reload server during development.

Dependencies snippet:

```json
"dependencies": {
  "express": "^5.2.0",
  "mongoose": "^9.0.0",
  "dotenv": "^17.2.3",
  "cors": "^2.8.5"
},
"devDependencies": {
  "nodemon": "^3.1.11"
},
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
