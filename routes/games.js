var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Game = require('../models/game');


router.get('/', function (req, res, next) {
  res.render('test_view');
});


router.post('/', function (req, res, next) {
  var game = new Game({
    name: "test game"
  });
  game.save();
  res.redirect('/');
});

module.exports = router;
