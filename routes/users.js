var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var User = require('../models/user')
var Game = require('../models/game');
var Room = require('../models/room');
var Choice = require('../models/choice');

router.post("/signup", (req, res, next) => {
  console.log("inside user post body looks like:")
  console.log(req.body)
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
        "secret_secret_extra_super_secret",
        { expiresIn: "10h" }
      );

      res.status(201).json({
        message: "User created!",
        result: result,
        token: token
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
  let fetchedUser;
  console.log("looking for headers in login:")
  console.log(req.headers)
  console.log("inside backend login, req looks like this:")
  console.log(req.body)
  User.findOne({email: req.body.email}).then(user => {
    if(!user){
      return response(401).json({
        message: "User not found"
      })
    }
    fetchedUser = user;
    console.log("user found")
    console.log(user)

    console.log("bcrypt.compare")
    console.log(bcrypt.compare(req.body.password, user.password))
    return bcrypt.compare(req.body.password, user.password)
  }).then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      console.log("bcrypt.compare passed right?")
      console.log(result)


      console.log("token details:")
      console.log(fetchedUser)

      var token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_secret_extra_super_secret",
        { expiresIn: "10h" }
      );

      res.status(200).json({
        token: token,
        user_id: fetchedUser._id
      });
    }).catch(err => {
    return res.status(401).json({
      message: "auth failed"
    });
  });
});

module.exports = router;
