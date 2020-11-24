var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');

var User = require('../models/user.js');
var Group = require('../models/group.js');

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


router.get('/', function(req, res, next) {
    
    Group.find({}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        res.json(user)
    });
})

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




module.exports = router;