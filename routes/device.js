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
const { monthsShort } = require('moment-timezone');

var mqttClient = new mqttHandler();
mqttClient.connect();

router.post('/', function(req, res, next) {
    var deviceModel = new Device();


    deviceModel.device_id = req.body.device_id;
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
//장치 추가

router.delete('/:device_id',(req,res)=>
{
    Author.findOneAndDelete({device_id:req.params.device_id});
    Device.findOneAndDelete({device_id:req.params.device_id});
    res.send("Device Deleted");
});
//장치 삭제



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

router.post('/info/:device_id',(req,res)=>
{
    var deviceSetting=new Device();
    deviceSetting.device_id=req.params.device_id;
    deviceSetting.device_name=req.body.device_name;
    deviceSetting.device_type=req.body.device_type;
    deviceSetting.start_setting=req.body.start_setting;
    deviceSetting.end_setting=req.body.end_setting;
   deviceSetting.save();
    res.send("Device info is added");
});

router.post('/run/:device_id/:device_type',(req,res)=>
{   
    Device.findOne({device_id:req.params.device_id, device_type:req.params.device_type}, function(err, device)
    {
        var setting = req.body.setting;
        if (!setting) {
            setting = device.start_setting
        };
        var msg = {
            type: req.params.device_type,
            setting: setting

        };
        var data = JSON.stringify(msg);
        mqttClient.sendMessage(req.params.device_id, data);
        
        console.log(setting);
    });
    res.send("Send message to "+req.params.device_id);
});

router.get('/stop/:device_id/:device_type',(req,res)=>
{
    var msg = {
        type: req.params.device_type,
        setting: 0
    };
    var data = JSON.stringify(msg)
    mqttClient.sendMessage(req.params.device_id, data)
    res.send("Send message to "+req.params.device_id);
});

router.get('/:device_id',(req,res)=>
{
    Device.findOne({device_id:req.params.device_id},function(err,data)
    {
        res.json(data);
    })
});

module.exports = router;
