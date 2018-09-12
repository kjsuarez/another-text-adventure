var express = require('express');
var router = express.Router();
//var jwt = require('jsonwebtoken');
// var checkAuth = require('../middleware/auth_checker');
// var ownershipChecker = require('../middleware/ownership_checker');

var Game = require('../models/game');
var User = require('../models/user')

// router.get('/moop', function (req, res, next) {
//   res.render('test_view');
// });

router.get('/', function (req, res, next) {
  // Game.find()
  // .exec(function(err, games) {
  //   if (err) {
  //     return res.status(500).json({
  //       title: 'an error occured while retrieving messages',
  //       error: err
  //     });
  //   }
  //   res.status(200).json({
  //     message: 'success',
  //     obj: games
  //   });
  // });

  console.log("here I am");
  const games = [
    { id: "0", name: "another text adventure", start_room_id: "0", current_room_id: null },
    { id: "1", name: "Dungeonland", start_room_id: "3", current_room_id: null },
    { id: "2", name: "roomless game", start_room_id: null, current_room_id: null }
  ]

  res.status(200).json({
    message: "sending games",
    obj: games
  });
});


// router.get('/populated/:id', function (req, res, next) {
//   Game.findById(req.params.id)
//   .populate('rooms')
//   .populate('choices')
//   .exec(function(err, game) {
//     if (err) {
//       return res.status(500).json({
//         title: 'an error occured while retrieving messages',
//         error: err
//       });
//     }
//     res.status(200).json({
//       message: 'success',
//       obj: game
//     });
//   });
// });
//
// router.get('/:id', function (req, res, next) {
//   Game.findById(req.params.id, function(err, game) {
//     if (err) {
//       return res.status(500).json({
//         title: 'error retrieving game',
//         error: err
//       });
//     }
//     if (!game) {
//       return res.status(500).json({
//         title: 'could not find game',
//         error: {message: 'game not found'}
//       });
//     }
//     res.status(200).json({
//       message: 'success',
//       obj: game
//     });
//   });
// });
//
// router.post(
//   '/',
//   checkAuth,
//   (req, res, next) => {
//
//     var token = req.headers.authorization.split(" ")[1];
//     var user_id = jwt.verify(token, "secret_secret_extra_super_secret").userId
//     console.log(" user-id from token looks like:")
//     console.log(user_id)
//     User.findById(user_id, function(err, user) {
//       if (err) {
//         console.log("error:")
//         console.log(err)
//         return res.status(500).json({
//           title: 'error retrieving user',
//           error: err
//         });
//       }
//       if (!user) {
//         console.log("no user found")
//         return res.status(500).json({
//           title: 'could not find user',
//           error: {message: 'user not found'}
//         });
//       }
//
//       var game = new Game({
//         name: req.body.name,
//         start_room_id: req.body.start_room_id
//       });
//       game.save(function (err, result) {
//         if (err) {
//           return res.status(500).json({
//             title: 'Something went pair shaped trying to save game',
//             error: err
//           });
//         }
//
//         user.games.push(result)
//         user.save();
//
//         res.status(201).json({
//           message: 'saved game',
//           obj: result
//         });
//       });
//
//     });
//
//   }
// );
//
// router.patch(
//   '/:id',
//  checkAuth,
//  ownershipChecker,
//  function (req, res, next) {
//   Game.findById(req.params.id, function(err, game) {
//     if (err) {
//       return res.status(500).json({
//         title: 'error retrieving game',
//         error: err
//       });
//     }
//     if (!game) {
//       return res.status(500).json({
//         title: 'could not find game',
//         error: {message: 'game not found'}
//       });
//     }
//
//     console.log("request body on game update backend")
//     console.log(req.body)
//
//     game.name = req.body.name
//     game.start_room_id = req.body.start_room_id
//     game.rooms = req.body.room_ids
//     game.choices = req.body.choice_ids
//
//     game.save(function(err, result) {
//       if (err) {
//         return res.status(500).json({
//           title: 'Something went tits up',
//           error: err
//         });
//       }
//       res.status(200).json({
//         message: 'updated game',
//         obj: result
//       });
//     });
//   });
// });


module.exports = router;
