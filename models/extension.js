var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var extension = new Schema({
    name: { type: String, default: "New Extension" },
    description: { type: String, default: "A new great extension" },
    data: { type: String, default: '{"html":"","css":"","js":""}' },
    official: { type: Boolean, default: false },
    category: { type: String, default:"Misc"},
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    live: { type: Boolean, default: false }
});

extension.virtual('did').get(function () {
    return "d" + this._id.toString();
});


module.exports = mongoose.model('Extension', extension);