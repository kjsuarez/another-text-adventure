var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();
var jwt = require('jsonwebtoken');
var checkAuth = require('../middleware/auth_checker');
var ownershipChecker = require('../middleware/ownership_checker');

var Game = require('../models/game');
var User = require('../models/user');
var GameSave = require('../models/game_save');

router.post('/user/:user_id/game/:game_id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      console.log("error:")
      console.log(err)
      return res.status(500).json({
        title: 'error retrieving user',
        error: err
      });
    }
    if (!user) {
      console.log("no user found")
      return res.status(500).json({
        title: 'could not find user',
        error: {message: 'user not found'}
      });
    }

    Game.findById(req.params.game_id, function(err, game) {

      var game_save = new GameSave({
        game: game,
        current_room: game.start_room_id,
        user: user
      });

      game_save.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            title: 'Something went pair shaped trying to create game_save',
            error: err
          });
        }



        user.game_saves.push(result)
        user.save();

        res.status(201).json({
          message: 'saved game',
          obj: result
        });
      });
    });



  });
});

router.get('/user/:user_id/game/:game_id', function (req, res, next) {
  console.log("inside game save get route")

  User.findOne({_id: new ObjectId(req.params.user_id)  })
  .then(user => {

    if (!user) {
      console.log("no user found")
      return res.status(500).json({
        title: 'could not find user',
        error: {message: 'user not found'}
      });
    }

    GameSave.findOne({game: new ObjectId(req.params.game_id), user: new ObjectId(req.params.user_id)})
    .then(game_save => {

      if(!game_save){
        console.log("no save found")
        return res.status(200).json({
          message: 'success',
          obj: false
        });
      }else{
        res.status(200).json({
          message: 'success',
          obj: game_save
        });
      }

    })
  })

});


router.patch('/save/:save_id/room/:room_id', function(req, res, next) {
  console.log("room_id:")
  console.log(req.params.room_id)
  console.log()
  console.log()
  GameSave.findById(req.params.save_id, function(err, game_save) {

    if (!game_save) {
      return res.status(500).json({
        title: 'could not find save',
        error: {message: 'save not found'}
      });
    }

    game_save.current_room = req.params.room_id

    game_save.save(function (err, result) {
      if (err) {
        console.log(err)
        return res.status(500).json({
          title: 'Something went pair shaped updating gameSave',
          error: err
        });
      }

      console.log("result inside game_save update backend:")
      console.log(result)
      res.status(201).json({
        message: 'saved game',
        obj: result
      });
    });
  });

});

module.exports = router;
