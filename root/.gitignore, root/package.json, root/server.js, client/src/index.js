// root/.gitignore
node_modules/
build/
.env
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*

// root/package.json
{
  "name": "my-web-app",
  "version": "1.0.0",
  "description": "A web application using Node.js, React, and MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.10.9",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.4",
    "concurrently": "^5.3.0"
  },
  "author": "",
  "license": "ISC"
}

// root/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);