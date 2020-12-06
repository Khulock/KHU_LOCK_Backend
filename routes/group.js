var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');

var User = require('../models/user.js');
var Group = require('../models/group.js');
var Author = require('../models/author');
var Device=require('../models/device');
router.post('/', function(req, res, next) {
    const group_name = req.body.group_name;

    var groupModel = new Group();
    groupModel.group_name =group_name;

    groupModel
    .save()
    .then(newPost => {
      console.log("Create");
      res.status(200).json({
        message: 'Create success',
        data: {
          group_id: newPost.group_id,
          group_name: newPost.group_name
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });


});
//그룹 추가

router.delete('/:group_id',(req,res)=>
{
    Group.count({group_id:req.params.group_id},function(err,count)
    {
        if(count!=0)
        {
            Group.findOneAndDelete({group_id:req.params.group_id});
            res.send(req.params.group_id+" Group is Deleted");
        }
        else  
        {
            res.send("Group doesn't Exist");
        }
    });
});
//그룹 삭제
router.post('/:device_id',(req,res)=>
{
    var author=new Author();
    author.device_id = req.params.device_id;
    author.group_id = req.body.group_id;
    
    author.save();
    res.send(req.params.device_id+' is added');
});//권한 추가

router.get('/mygroup', function(req, res, next) {
  var token = req.headers['authorization'];

  if (!token) {
    res.status(403).json({
      message: 'no token'
    });
  }

  let decoded = jwt.verify(token, 'khulock');

  User.findOne({id: decoded.user_id}, function(err, user) {
    console.log(user);
    User.find({group_id: user.group_id}, function(err, user2) {
      for (var i=0; i<user2.length; i++) {
        console.log(user2[i]);
      }

      Group.findOne({group_id: user.group_id}, function(err, group) {
        res.status(200).json({
          group_name: group.group_name,
          user: user2
        })
      })

    })
  })



})
//그룹 조회

router.put('/user/:user_id',(req,res)=>
{
    User.findOne({id:req.params.user_id},function(err,data)
    {
        if(data.group_id===null)
        {
        User.findOneAndUpdate({id: req.params.user_id}, {$set: {group_id: req.body.group}},function(err,result)
        {
            if(err) res.send(err);
            else res.send("User is Added in Group");
        });
    }
    else{
        User.findOneAndUpdate({id: req.params.user_id}, {$set: {group_id: null}},function(err,result)
        {
            if(err) res.send(err);
            else res.send("User is Deleted by Group");
        });
    }    
});
}); 
//그룹에 사용자 추가 , 삭제

router.get('/device',(req,res)=>
{
    User.findOne({id:req.body.user_id},function(err,user)
     {
    var deviceList=new Array();
    Author.find({group_id:user.group_id},function(err,data)
    {
      for(var i=0;i<data.length;i++)
      {
        deviceList.push(data[i].device_id);
      }   
    });
    console.log(deviceList);
    setTimeout(function(){
    Device.find({device_id :{$in :deviceList}},function(err,info)
    {
      res.send(info);
    });
  },1000);
    });
});

module.exports = router;
