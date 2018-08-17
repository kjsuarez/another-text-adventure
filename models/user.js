var mongoose  = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
  first_name: {type: String},
  last_name: {type: String},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);
