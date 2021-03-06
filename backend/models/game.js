var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String},
  start_room_id: {type: String},
  current_room_id: {type: String},
  rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}],
  choices: [{type: Schema.Types.ObjectId, ref: 'Choice'}]
});

module.exports = mongoose.model('Game', schema);
