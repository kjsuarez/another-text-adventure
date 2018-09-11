const express = require('express');

const app = express();

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

app.use('/game-backend', function (req, res, next) {
  console.log("here I am");
  const games = [
    { id: "0", name: "another text adventure", start_room_id: "0", current_room_id: null },
    { id: "1", name: "Dungeonland", start_room_id: "3", current_room_id: null },
    { id: "2", name: "roomless game", start_room_id: null, current_room_id: null }
  ]

  res.status(200).json({
    message: "sending games",
    obj: games
  });
});

module.exports = app;
