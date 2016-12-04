var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var user = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    extensions: [{ type: Schema.Types.ObjectId, ref: 'Extension' }],
    preferences: { type: Schema.Types.ObjectId, ref: 'Preferences' },
});

user.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

user.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);