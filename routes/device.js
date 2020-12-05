var express = require('express');
var router = express.Router();

const mqttHandler = require('../mqtt_handler');

var User = require('../models/user.js');
var Group = require('../models/group.js');
var History = require('../models/history');
var Device = require('../models/device.js')
var Author = require('../models/author');
const author = require('../models/author');
const device = require('../models/device.js');

var mqttClient = new mqttHandler();
mqttClient.connect();

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
//장치 추가

router.delete('/:device_id',(req,res)=>
{
    Author.findOneAndDelete({device_id:req.params.device_id});
    Device.findOneAndDelete({device_id:req.params.device_id});
    res.send("Device Deleted");
});
//장치 삭제

router.get('/group',(req,res)=>
{
    Author.find({group_id:req.body.group},function(err,data)
    {
        res.json(data);
    });
});
//장치 조회(그룹 전체)


router.post('/author', function(req, res, next) {
    var authorModel = new Author();

    authorModel.device_id = 'b82737eed6';
    authorModel.group_id = req.body.group_id;

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
//권한 부여

router.put('/info/:device_id',(req,res)=>
{
    var deviceSetting=new Device();
    deviceSetting=
    {
        device_name: req.body.device_name,
        device_type: req.body.device_type,
        start_setting: req.body.start_setting,
        end_setting: req.body.end_setting
    }
    Device.findOneAndUpdate({device_id:req.body.device_id},{$set:deviceSetting},function(err,data)
    {
        res.send("Device info is added");
    });
});

router.get('/run/:device_id',(req,res)=>
{
    mqttClient.publish(req.params.device_id,'khulock run motor', qos=2);
    res.send("Send message to "+req.params.device_id);
});

router.get('/stop/:device_id',(req,res)=>
{
    mqttClient.publish(req.params.device_id,'khulock stop motor', qos=2);
    res.send("Send message to "+req.params.device_id);
});

module.exports = router;