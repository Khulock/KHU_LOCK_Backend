var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb+srv://khulock:khulock123@khulock.mkdwk.mongodb.net/khulock');
autoIncrement.initialize(connection);


var groupSchema = new Schema({
    group_id: Number,
    group_name: String
}, {
    versionKey: false
});

groupSchema.plugin(autoIncrement.plugin, {
    model: 'group',
    field: 'group_id',
    startAt: 1,
    increment: 1
});

var group = connection.model('group', groupSchema);
module.exports = mongoose.model('group', groupSchema);

