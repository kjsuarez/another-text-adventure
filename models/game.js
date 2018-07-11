var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String},
  start_room_id: {type: String},
  current_room_id: {type: String}
});

module.exports = mongoose.model('Game', schema);
