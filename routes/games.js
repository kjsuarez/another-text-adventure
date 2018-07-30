var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');

router.get('/moop', function (req, res, next) {
  res.render('test_view');
});

router.get('/', function (req, res, next) {
  Game.find()
  .exec(function(err, games) {
    if (err) {
      return res.status(500).json({
        title: 'an error occured while retrieving messages',
        error: err
      });
    }
    res.status(200).json({
      message: 'success',
      obj: games
    });
  });
});

router.get('/:id', function (req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({
        title: 'error retrieving game',
        error: err
      });
    }
    if (!game) {
      return res.status(500).json({
        title: 'could not find game',
        error: {message: 'game not found'}
      });
    }
    res.status(200).json({
      message: 'success',
      obj: game
    });
  });
});

router.post('/', function (req, res, next) {
  var game = new Game({
    name: req.body.name,
    start_room_id: req.body.start_room_id
  });
  game.save(function (err, result) {

    res.status(201).json({
      message: 'saved game',
      obj: result
    });
  });
});


router.patch('/:id', function (req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({
        title: 'error retrieving game',
        error: err
      });
    }
    if (!game) {
      return res.status(500).json({
        title: 'could not find game',
        error: {message: 'game not found'}
      });
    }
    game.name = req.body.name
    game.start_room_id = req.body.start_room_id

    game.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Something went tits up',
          error: err
        });
      }
      res.status(200).json({
        message: 'updated game',
        obj: result
      });
    });
  });
});


module.exports = router;
