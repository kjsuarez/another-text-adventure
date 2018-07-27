var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');
var Room = require('../models/room');
var Choice = require('../models/choice');

router.post('/', function (req, res, next) { // at present a choice needs booth a game_id and a cause_room_id to function
  Game.findById(req.body.game_id, function (err, game) {
    if (err) {
      return res.status(500).json({
        title: 'Something went wrong while trying to find game',
        error: err
      });
    }
    if (!game) {
      return res.status(500).json({
        title: 'could not find game',
        error: {message: 'game not found'}
      });
    }

    var choice = new Choice({
      summery: req.body.summery,
      cause_room: req.body.cause_room_id,
      effect_room: req.body.effect_room_id,
      game: req.body.game_id
    });
    choice.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Something went wrong while trying to save choice',
          error: err
        });
      }
      game.choices.push(result);
      game.save();


      Room.findById(req.body.cause_room_id, function (err, room) {
        if (err) {
          return res.status(500).json({
            title: 'Something went wrong while trying to find room',
            error: err
          });
        }
        if (!room) {
          return res.status(500).json({
            title: 'could not find room',
            error: {message: 'game not found'}
          });
        }
        room.choices.push(result);
        room.save();
      });

      res.status(201).json({
        message: 'saved room',
        obj: result
      });
    });
  });
});

module.exports = router;
