var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var Group = require('../models/group.js');
var History = require('../models/history');
var Device = require('../models/device.js')
var Author = require('../models/author');
const author = require('../models/author');


router.post('/', function(req, res, next) {
    var deviceModel = new Device();

    deviceModel.device_id = 'b82737eed6';
    deviceModel.status = 1;
    deviceModel.device_time = Date.now();
    deviceModel.start_setting = 1;
    deviceModel.end_setting = 1;

    deviceModel
    .save()
    .then(newPost => {
        res.status(200).json({
            message: 'Success',
            data: {
                mewPost
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err
        });
    });
});


router.post('/author', function(req, res, next) {
    var authorModel = new Author();

    authorModel.device_id = 'b82737eed6';
    authorModel.group_id = 2;

    authorModel
    .save()
    .then(newPost => {
        res.status(200).json({
            message: 'Success',
            data: {
                newPost
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err
        });
    });
});


module.exports = router;