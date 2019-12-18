const config=require('config-lite')(__dirname);
const fs=require('fs');
const express=require('express');
const session=require('express-session');
const router=express.Router();

router.get('/',function (req,res,next) {
    res.render('index', {title: 'HTML'});
})

module.exports=router;