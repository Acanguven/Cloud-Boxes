var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var extension = new Schema({
    name: { type: String, unique: true, required: true },
    data: { type: String, required:true },
    official: {type: Boolean, default: false},
    category: { type: String, required: true}
});


module.exports = mongoose.model('Extension', extension);