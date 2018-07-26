var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');
var Room = require('../models/room');
var Choice = require('../models/choice');

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
    var choice = new Choice({
      summery: req.body.summery,
      cause_room: req.body.cause_room_id,
      effect_room: req.body.effect_room_id,
      game: req.body.game_id
    });
    choice.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Something went tits up',
          error: err
        });
      }
      game.choices.push(result);
      game.save();


      Room.findById(req.body.cause_room_id, function (err, room) {
        if (err) {
          return res.status(500).json({
            title: 'Something went tits up',
            error: err
          });
        }
        if (!room) {
          return res.status(500).json({
            title: 'could not find game',
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



//  router.post('/', function (req, res, next) {
//   Game.findById(req.body.game_id, function (err, game) {
//     if (err) {
//       return res.status(500).json({
//         title: 'Something went tits up',
//         error: err
//       });
//     }
//     if (!game) {
//       return res.status(500).json({
//         title: 'could not find game',
//         error: {message: 'game not found'}
//       });
//     }
//     var room = new Room({
//       name: req.body.name,
//       description: req.body.description,
//       game: req.body.game_id
//     });
//     room.save(function (err, result) {
//       if (err) {
//         return res.status(500).json({
//           title: 'Something went tits up',
//           error: err
//         });
//       }
//       game.rooms.push(result);
//       game.save();
//       res.status(201).json({
//         message: 'saved room',
//         obj: result
//       });
//     });
//   });
// });
//
//
//
// router.patch('/:id', function (req, res, next) {
//   Room.findById(req.params.id, function(err, room) {
//     if (err) {
//       return res.status(500).json({
//         title: 'error retrieving room',
//         error: err
//       });
//     }
//     if (!room) {
//       return res.status(500).json({
//         title: 'could not find room',
//         error: {message: 'room not found'}
//       });
//     }
//     room.name = req.body.name;
//     room.description = req.body.description;
//     room.save(function(err, result) {
//       if (err) {
//         return res.status(500).json({
//           title: 'Something went tits up',
//           error: err
//         });
//       }
//       res.status(200).json({
//         message: 'updated room',
//         obj: result
//       });
//     });
//   });
// });
//
//
