const express = require('express');
const  mongoose  = require('mongoose');
const authorizedDevice=require('./model/authorizedDevice');
const deviceInfo=require('./model/deviceInfo');
const group=require('./model/group');
const history=require('./model/history');
const user=require('./model/user');
const router = express.Router(); 

router.get('/', (req, res) => { // app 대신 router에 연결
  res.send("Hello World!");
});

router.post('/group',(req,res)=>
{
    var addOne=new group({group_id:req.body.id,group_name:req.body.name});
    group.count({group_id:addOne.group_id},function(err,count)
    {
        if(!count)
        {
            addOne.save();
            res.send("Add group");
        }
        else  
        {
            res.send("Group ID Already Exists");
        }
    });
});
/*그룹 추가
{
    "id":Number,
    "name":String
}
*/

router.delete('/group/:group_id',(req,res)=>
{
    group.count({group_id:req.params.group_id},function(err,count)
    {
        if(count!=0)
        {
            group.findOneAndDelete({group_id:req.params.group_id});
            res.send(req.params.group_id+" Group is Deleted");
        }
        else  
        {
            res.send("Group ID Not Exists");
        }
    });
});
//그룹 삭제

router.get('/group/:group_id',(req,res)=>
{
    var result;
    var userList=new Array();
    group.findOne({group_id:req.params.group_id},function(err,groups)
    {
        user.find({group_id:groups.group_id},function(err,users)
        {
            users.forEach(item=>userList.push(item.user_name));
            result={
                "group_id":groups.group_id,
                "group_name":groups.group_name,
                "group":userList
            }
            res.json(result);
        });
    });
});
//그룹 조회

router.put('/group/user/:user_id',(req,res)=>
{
    user.findOne({user_id:req.params.user_id},function(err,data)
    {
        if(data.group_id===null)
        {
        user.findOneAndUpdate({user_id: req.params.user_id}, {$set: {group_id: req.body.group}},function(err,result)
        {
            if(err) res.send(err);
            else res.send("User is Added in Group");
        });
    }
    else{
        user.findOneAndUpdate({user_id: req.params.user_id}, {$set: {group_id: null}},function(err,result)
        {
            if(err) res.send(err);
            else res.send("User is Deleted by Group");
        });
    }    
});
}); 
/*그룹에 사용자 추가 / 삭제
{
    "group":Number
}
*/

router.post('/user',(req,res)=>
{
    var addOne=new user(
        {
            user_id:req.body.user_id, //auto index
            user_name:req.body.name,
            author_status:false,
            group_id:null
        });
    user.findOne({user_id:req.body.user_id},function(err,data)
    {
        if(data) res.send("Already Exist ID");
        else 
        {
            addOne.save();
            res.send("User Added");
        }
    });
});
/*사용자 추가
{
    "id":Number
    "name":String
}
*/

router.get('/user/:user_id',(req,res)=>
{
    user.find({user_id:req.params.user_id},function(err,users)
    {
        res.json(users);
    });
});
//사용자 조회

router.delete('/user/:user_id',(req,res)=>
{
    user.count({user_id:req.params.user_id},function(err,count)
    {
        if(count!=0)
        {
            user.findOneAndDelete({user_id:req.params.user_id});
            res.send(req.params.user_id+" User is Deleted");
        }
        else  
        {
            res.send("User ID Not Exists");
        }
    });
});
//사용자 삭제

router.get('/user/author/:user_id',(req,res)=>
{
    user.findOne({user_id:req.params.user_id},{user_name:1,author_status:1},function(err,data)
    {
        res.json(data);
    });  
});
/*권한 확인
{
    "id":Number
}
*/
router.post('/device',(req,res)=>
{
    var addOne=new authorizedDevice(
        {
            group_id:req.body.group,
            device_id:req.body.device
        });
    addOne.save();
    console.log(addOne);
    res.send("Device Added");
});
/*장치 추가
{
    "group":Number
    "device":Number
}
*/

router.delete('/device/:device_id',(req,res)=>
{
    authorizedDevice.findOneAndDelete({device_id:req.params.device_id});
    res.send("Device Deleted");
});
//장치 삭제

router.get('/device/group',(req,res)=>
{
    authorizedDevice.find({group_id:req.body.group},function(err,data)
    {
        res.json(data);
    });
});
/*장치 조회(그룹 전체)
{
    "group":Number
}
*/
module.exports = router;