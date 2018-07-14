var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String},
  description: {type: String},
  game: {type: Schema.Types.ObjectId, ref: 'Game'}
});

module.exports = mongoose.model('Room', schema);
