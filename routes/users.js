var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var User = require('../models/user')
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
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});




router.post('/login', (req, res, next) => {
  User.findOne({email: req.body.email}).then(user => {
    if(!user){
      return response(401).json({
        message: "User not found"
      })
    }
    return bycrpt.compare(req.body.password, user.password)
  }).then( result => {
    if (!result) {
      return response(401).json({
        message: "Auth failed"
      })
    }
    const token = jwt.sign(
      {email: user.email, user_id: user._id},
       'secret_secret_very_secret',
       {expiresIn: "1h"}
     );
  }).catch(err => {
    return response(401).json({
      message: "auth failed"
    })
  })

});

module.exports = router;
