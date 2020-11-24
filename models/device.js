var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb+srv://khulock:khulock123@khulock.mkdwk.mongodb.net/khulock');
autoIncrement.initialize(connection);


var deviceSchema = new Schema({
    id: Number,
    device_id: String,
    status: Number,
    device_time: Date,
    start_setting: Number,
    end_setting: Number
}, {
    versionKey: false
});

deviceSchema.plugin(autoIncrement.plugin, {
    model: 'device',
    field: 'id',
    startAt: 1,
    increment: 1
});

var device = connection.model('device', deviceSchema);
module.exports = mongoose.model('device', deviceSchema);

