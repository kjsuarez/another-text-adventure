var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');


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


router.post('/', function (req, res, next) {
  console.log(req);
  var game = new Game({
    name: req.body.name
  });
  game.save(function (err, result) {

    res.status(201).json({
      message: 'saved game',
      obj: result
    });
  });
});







module.exports = router;
