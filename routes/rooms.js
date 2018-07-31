var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');
var Room = require('../models/room');

// router.get('/', function (req, res, next) {
//   Game.findById("5b5a55471ddb3f0902cc2e37")
//   .populate('rooms')
//   .exec(function(err, games) {
//     if (err) {
//       return res.status(500).json({
//         title: 'an error occured while retrieving messages',
//         error: err
//       });
//     }
//     res.status(200).json({
//       message: 'success',
//       obj: games
//     });
//   });
// });

router.get('/games-rooms/:id', function (req, res, next) {
  Game.findById(req.params.id)
  .populate('rooms')
  .exec(function(err, game) {
    if (err) {
      return res.status(500).json({
        title: 'an error occured while retrieving messages',
        error: err
      });
    }
    res.status(200).json({
      message: 'success',
      obj: game
    });
  });
});

router.post('/', function (req, res, next) {
  Game.findById(req.body.game_id, function (err, game) {
    if (err) {
      return res.status(500).json({
        title: 'Something went tits up',
        error: err
      });
    }
    if (!game) {
      return res.status(500).json({
        title: 'could not find game',
        error: {message: 'game not found'}
      });
    }
    var room = new Room({
      name: req.body.name,
      description: req.body.description,
      game: req.body.game_id
    });
    room.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Something went tits up',
          error: err
        });
      }
      game.rooms.push(result);
      game.save();
      res.status(201).json({
        message: 'saved room',
        obj: result
      });
    });
  });
});



router.patch('/:id', function (req, res, next) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return res.status(500).json({
        title: 'error retrieving room',
        error: err
      });
    }
    if (!room) {
      return res.status(500).json({
        title: 'could not find room',
        error: {message: 'room not found'}
      });
    }
    room.name = req.body.name;
    room.description = req.body.description;
    room.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Something went tits up',
          error: err
        });
      }
      res.status(200).json({
        message: 'updated room',
        obj: result
      });
    });
  });
});

module.exports = router;
