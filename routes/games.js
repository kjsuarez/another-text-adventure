var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var checkAuth = require('../middleware/auth_checker');

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
    console.log("looking for headers in public games get route:")
    console.log(req.headers)
    res.status(200).json({
      message: 'success',
      obj: games
    });
  });
});

router.get('/populated/:id', function (req, res, next) {
  Game.findById(req.params.id)
  .populate('rooms')
  .populate('choices')
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
    console.log("looking for headers in game get route:")
    console.log(req.headers)
    res.status(200).json({
      message: 'success',
      obj: game
    });
  });
});

router.post(
  '/',
  checkAuth,
  (req, res, next) => {
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
  }
);


// router.post(
//   "",
//   checkAuth,
//   multer({ storage: storage }).single("image"),
//   (req, res, next) => {
//     const url = req.protocol + "://" + req.get("host");
//     const post = new Post({
//       title: req.body.title,
//       content: req.body.content,
//       imagePath: url + "/images/" + req.file.filename
//     });
//     post.save().then(createdPost => {
//       res.status(201).json({
//         message: "Post added successfully",
//         post: {
//           ...createdPost,
//           id: createdPost._id
//         }
//       });
//     });
//   }
// );


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
    console.log("patching game: ")
    console.log(req.body)

    game.name = req.body.name
    game.start_room_id = req.body.start_room_id
    game.rooms = req.body.room_ids
    game.choices = req.body.choice_ids

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
