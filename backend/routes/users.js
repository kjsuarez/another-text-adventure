var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var User = require('../models/user');
var Game = require('../models/game');
var Room = require('../models/room');
var Choice = require('../models/choice');

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      var token = jwt.sign(
        { email: result.email, userId: result._id },
        process.env.JWT_KEY,
        { expiresIn: "10h" }
      );
      res.status(201).json({
        message: "User created!",
        result: result,
        token: token,
        expiresIn: 3600
      });
    })
      .catch(err => {
        console.log("error")
        console.log(err)
        res.status(500).json({
          error: err
        });
      });
  });
});




router.post('/login', (req, res, next) => {
  let fetchedUser;
  let gameIds;
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user){
      return response(401).json({
        message: "User not found"
      })
    }
    fetchedUser = user;
    gameIds = [];
    fetchedUser.games.forEach((game, index) => {
      gameIds.push(game.toString())
    });
    return bcrypt.compare(req.body.password, user.password)
  }).then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      var token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "10h" }
      );
      res.status(200).json({
        token: token,
        user_id: fetchedUser._id,
        user_games: gameIds,
        expiresIn: 36000 // 10hrs
      });
    }).catch(err => {
      console.log(err)
    return res.status(401).json({
      message: "auth failed"
    });
  });
});

router.patch("/update", (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  var user_id = jwt.verify(token, process.env.JWT_KEY).userId
  User.findById(user_id, function(err, user) {
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
    user.first_name = req.body.first_name
    user.last_name = req.body.last_name

    user.save(function(err, result) {
      if (err) {
        console.log("ERROR in user patch:")
        console.log(err)
        return res.status(500).json({
          title: 'Something went tits up',
          error: err
        });
      }
      res.status(200).json({
        message: 'updated user',
        obj: result
      });
    });
  });
});

router.post('/games', (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  var user_id = jwt.verify(token, process.env.JWT_KEY).userId
  User.findById(user_id, function(err, user) {
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

    res.status(200).json({
      message: 'success',
      obj: user.games
    });

  });
});

router.post('/full-games', (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  var user_id = jwt.verify(token, process.env.JWT_KEY).userId
  User.findById(user_id)
  .populate('games')
  .exec(function(err, user){
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

    res.status(200).json({
      message: 'success',
      obj: user
    });

  });
});

router.get("/:id", (req, res, next ) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'error retrieving snoozer',
        error: err
      });
    }
    if (!user) {
      return res.status(500).json({
        title: 'could not find user',
        error: {message: 'user not found'}
      });
    }
    res.status(200).json({
      message: 'success',
      obj: user
    });
  });
});



module.exports = router;
