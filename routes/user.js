var express = require('express');
var router = express.Router();

const mqttHandler = require('../mqtt_handler');
const jwt = require('jsonwebtoken');

var User = require('../models/user.js');
var Group = require('../models/group.js');
var History = require('../models/history');
const Author = require('../models/author.js');

var mqttClient = new mqttHandler();
mqttClient.connect();

router.post('/', function(req, res, next) {
  
  const group_id = 0;
  const name = req.body.name;
  const author_status = false;
  var userModel = new User();

  userModel.group_id = group_id;
  userModel.name = name;
  userModel.author_status = author_status;

  userModel
    .save()
    .then(newPost => {
      console.log("Create");
      res.status(200).json({
        message: 'Create success',
        data: {
          id: newPost.id,
          group_id: newPost.group_id,
          name: newPost.name,
          author_status: newPost.author_status
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
});
//사용자 생성

router.get('/:user_id',(req,res)=>
{
    User.find({id:req.params.user_id},function(err,users)
    {
        res.json(users);
    });
});
//사용자 조회

router.delete('/:user_id',(req,res)=>
{
    User.count({id:req.params.user_id},function(err,count)
    {
        if(count!=0)
        {
            User.findOneAndDelete({id:req.params.user_id});
            res.send(req.params.user_id+" User is Deleted");
        }
        else  
        {
            res.send("User ID Not Exists");
        }
    });
});
//사용자 삭제

router.post('/auth', function(req, res, next) {
  var historyModel = new History();
  var authorModel = new Author();

  var user_name = req.body.user_name;
  var door_mac = req.body.door_mac;
  console.log(req.body);

  var user_id;
  var group_id;
  var author_status;

  User.findOne({'name': user_name}, function(err, user) {
    if (err) return res.status(500).json({error: err});
    console.log(user);
    
    user_id = user.id;
    group_id = user.group_id;
    author_status = 1;

    Author.findOne({'group_id': group_id}, function(err, author) {
      if (err) return res.status(500).json({error: err});
      console.log(author);
      if (author.device_id == door_mac) {
        
        const token = jwt.sign({
          user_id: user_id,
          name: user_name
        }, 'khulock', {
          expiresIn: '1000h'
        });

        historyModel.user_id = user_id;
        historyModel.check_enterout = 1;

        historyModel
        .save()
        .then(newPost => {
          res.status(200).json({
            message: 'Enter',
            data: {
              id: user.id,
              token
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err
          });
        });

        User.update({id: user_id}, {author_status: true}, function(err, user) {
          if (err) return res.status(500).json({errro: err});
        });
        mqttClient.sendMessage("Success");
      }
    })
  }); 
});
//권한 부여


router.post('/out', function(req, res, next) {
  var historyModel = new History();

  var user_id = req.body.user_id;

  historyModel.user_id = user_id;
  historyModel.check_enterout = 0;


  historyModel
    .save()
    .then(newPost => {
      res.status(200).json({
        message: 'out',
        data: {
          id: newPost.id,
          group_id: newPost.user_id,
          access_time: newPost.access_time,
          check_enterout: newPost.check_enterout
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
});
//퇴실 기능

router.get('/history/:user_id', function(req, res, next) {
  var user_id = req.params.user_id;
  var token = req.headers['authorization'];

  if (!token) {
    res.status(403).json({
      message: 'no token'
    });
  }

  let decoded = jwt.verify(token, 'khulock');

  User.findOne({id: decoded.user_id}, function(err, user) {
    if (err) return res.status(500).json({error: err});

    User.findOne({id: user_id}, function(err, user2) {
      if (err) return res.status(500).json({error: err});

      if (user.group_id == user2.group_id) {
        History.find({user_id: user_id}, function(err, history) {
          history.access_time;
          if(err) return res.status(500).json({error: err});
          res.json({history});
        });
      } else {
        res.status(404).json({message: 'group does not match'});
      }
      

    })

  })
});
//기록 조회

    


module.exports = router;
