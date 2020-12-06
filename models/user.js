var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


var Schema = mongoose.Schema;


var connection = mongoose.createConnection('mongodb+srv://khulock:khulock123@khulock.mkdwk.mongodb.net/khulock');
autoIncrement.initialize(connection);


var userSchema = new Schema({
    id: Number,
    group_id: Number,
    user_name: String,
    author_status: Boolean
},{
    versionKey: false
});


userSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: 'id',
    startAt: 1,
    increment: 1
})


var User = connection.model('user', userSchema);
module.exports = mongoose.model('user', userSchema);
