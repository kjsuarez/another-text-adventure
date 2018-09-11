const express = require('express');

const app = express();

app.use('/api/games', function (req, res, next) {
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
