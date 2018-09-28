var User = require('../models/user')
var Game = require('../models/game');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user_id = jwt.verify(token, process.env.JWT_KEY).userId

  User.findById(user_id, function(err, user) {
    try{
      var string_array = []
      user.games.forEach((game, index) => {
        string_array[index] = game.toString()
      });

      if(!string_array.includes(req.params.id)){
        throw 'userDoesntOwnGame';
      }

      next()
    } catch (error) {
      console.log(error)
      res.status(401).json( { message: "user can't edit this game" } )
    }


  });

}
