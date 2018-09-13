const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

//remote server via mongo atlas
//mongoose.connect('mongodb+srv://kjsuarez:' + process.env.MONGO_ATLAS_PW + '@anothertextadventure-ddkor.mongodb.net/text-adventure-db?retryWrites=true')

//local server via $ mongod
mongoose.connect('mongodb://localhost:27017/text-adventure-db')

.then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });



const gameRoutes = require('./routes/games');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/game-backend', gameRoutes);

module.exports = app;
