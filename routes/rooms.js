var express = require('express');
var async = require('async');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');
var Room = require('../models/room');

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

router.post('/batch', function (req, res, next) {
  const req_json = req.body
  const error_found = false;
  const res_rooms = []

  async.eachSeries(req_json,
  function(req_object, callback) {
    var room = new Room({
      name: req_object.room.name,
      description: req_object.room.description,
      game: req_object.room.game_id
    });

    room.save(function (err, result) {
      if (err) {
        error_found = true;
      }else{
        res_rooms.push({id: result._id, temp_id: req_object.room.temp_id})
      }
      callback();
    });

  },
  function(err) {

    if (error_found) {
      return res.status(500).json({
        title: 'Something went tits up',
        error: err
      });
    }else {
      console.log(res_rooms)
      res.status(201).json({
        message: 'saved room',
        obj: res_rooms
      });
    }

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
