var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment-timezone');

const dateKorea = moment.tz(Date.now(), 'Asia/Seoul');

var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb+srv://khulock:khulock123@khulock.mkdwk.mongodb.net/khulock');
autoIncrement.initialize(connection);


var historySchema = new Schema({
    id: Number,
    user_id: Number,
    access_time: {type: Date, default: dateKorea},
    check_enterout: Number
}, {
    versionKey: false
});

historySchema.plugin(autoIncrement.plugin, {
    model: 'history',
    field: 'id',
    startAt: 1,
    increment: 1
});

var history = connection.model('history', historySchema);
module.exports = mongoose.model('history', historySchema);
