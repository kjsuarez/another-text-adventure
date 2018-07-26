var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String},
  description: {type: String},
  game: {type: Schema.Types.ObjectId, ref: 'Game'},
  choices: [{type: Schema.Types.ObjectId, ref: 'Choice'}]
});

module.exports = mongoose.model('Room', schema);
