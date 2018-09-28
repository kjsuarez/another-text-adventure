var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var async = require('async');

var Game = require('../models/game');
var Room = require('../models/room');
var Choice = require('../models/choice');


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

router.get('/games-choices/:id', function (req, res, next) {
  Game.findById(req.params.id)
  .populate('choices')
  .populate('rooms')
  .exec(function(err, game) {
    if (err) {
      return res.status(500).json({
        title: 'an error occured while retrieving choices',
        error: err
      });
    }
    console.log("game with choices populated:")
    console.log(game)
    res.status(200).json({
      message: 'success',
      obj: game
    });
  });
});

router.post('/batch', function (req, res, next) {
  const req_json = req.body
  const error_found = false;
  const res_choices = []

  async.eachSeries(req_json,
  function(req_object, callback) {
    var choice = new Choice({
      game: req_object.choice.game_id
    });
    console.log("recently generated choice in batch backend:")
    console.log(choice)
    choice.save(function (err, result) {
      if (err) {
        console.log(err)
        error_found = true;
      }else{
        res_choices.push({id: result._id, temp_id: req_object.choice.temp_id})
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
      console.log("what batch post choices backend sends to front")
      console.log(res_choices)
      res.status(201).json({
        message: 'saved choice',
        obj: res_choices
      });
    }

  });

});

router.post('/', function (req, res, next) { // at present a choice needs booth a game_id and a cause_choice_id to function
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

router.patch('/:id', function (req, res, next) {
  Choice.findById(req.params.id, function(err, choice) {
    if (err) {
      return res.status(500).json({
        title: 'error retrieving room',
        error: err
      });
    }
    if (!choice) {
      return res.status(500).json({
        title: 'could not find choice',
        error: {message: 'choice not found'}
      });
    }
    console.log("inside choice patch, body looks like this:")
    console.log(req.body)
    choice.summery = req.body.summery;
    choice.cause_room = req.body.cause_room_id;
    choice.effect_room = req.body.effect_room_id;

    choice.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Something went tits up',
          error: err
        });
      }
      res.status(200).json({
        message: 'updated choice',
        obj: result
      });
    });
    // if cause room is being updated, the new cause room needs to have choice added to it's choices array
  });
});

module.exports = router;
