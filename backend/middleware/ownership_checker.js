var User = require('../models/user')
var Game = require('../models/game');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("start of ownership checker-")
  console.log("game id via params looks like this: ")
  console.log(req.params.id)
  console.log("userid from token looks like this:")
  const token = req.headers.authorization.split(" ")[1];
  const user_id = jwt.verify(token, process.env.JWT_KEY).userId
  console.log(user_id)

  User.findById(user_id, function(err, user) {
    console.log("users games:")
    console.log(user.games)
    try{
      var string_array = []
      user.games.forEach((game, index) => {
        string_array[index] = game.toString()
      });

      console.log("string array includes params id:")
      console.log(string_array.includes(req.params.id))

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
