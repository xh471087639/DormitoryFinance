const config=require('config-lite')(__dirname);
const fs=require('fs');
const express=require('express');
const session=require('express-session');
const router=express.Router();

router.get('/',function (req,res,next) {
    res.send('暂无主页');
})

module.exports=router;