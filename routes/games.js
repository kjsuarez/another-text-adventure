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


router.get('/', function (req, res, next) {
  Message.find()
    .exec(function(err, messages) {
      if (err) {
        return res.status(500).json({
          title: 'an error occured while retrieving messages',
          error: err
        });
      }
      res.status(200).json({
        message: 'success',
        obj: messages
      });
    });
});


router.post('/', function (req, res, next) {
  console.log("inside post route");
  var game = new Game({
    name: "yet another test game"
  });
  game.save();
  res.redirect('/');
});

module.exports = router;
