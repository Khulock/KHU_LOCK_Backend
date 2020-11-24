const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = () => {
    function connect() {
        var connection = mongoose.connect('mongodb+srv://khulock:khulock123@khulock.mkdwk.mongodb.net/khulock')
        // autoIncrement.initialize(connection);
    }

    connect();

    require('./models/user');
    require('./models/group');
    require('./models/history');
    require('./models/device');
    require('./models/author');

    console.log('mongodb connected');
    mongoose.connection.on('disconnected', connect);
};




/*
module.exports = () => {
    function connect() {
        const connection = mongoose.createConnection('mongodb+srv://khulock:khulock123@khulock.mkdwk.mongodb.net/khulock?retryWrites=true&w=majority', function(err) {
            if (err) {
                console.error('mongodb connection error', err);
            }
            autoIncrement.initialize(connection);
            console.log('mongodb connected');
        });
    }
    require('./models/user');
    
    connect();
    
    mongoose.connection.on('disconnected', connect);

    
}
*/

/*
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connected to mongod server');
});

mongoose.connect('mongodb://localhost:27017')
*/