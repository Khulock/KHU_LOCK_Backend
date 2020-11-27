var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var authorSchema = new Schema({
    device_id: String,
    group_id: Number
}, {
    versionKey: false
});


module.exports = mongoose.model('author', authorSchema);

