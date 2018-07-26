var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  summery: {type: String},
  cause_room: {type: Schema.Types.ObjectId, ref: 'Room'},
  effect_room: {type: Schema.Types.ObjectId, ref: 'Room'},
  game: {type: Schema.Types.ObjectId, ref: 'Game'}
});

module.exports = mongoose.model('Choice', schema);
