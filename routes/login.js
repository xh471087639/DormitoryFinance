const config=require('config-lite')(__dirname);
const path=require('path');
const fs=require('fs');
const sha1=require('sha1');
const multiparty=require('multiparty');
const express=require('express');
const session=require('express-session');

const powerModels=require('../models/power');
const userModels=require('../models/user');

const router=express.Router();

router.get('/',function (req,res,next) {
    res.render('login', {title: 'HTML'});
})
router.post('/',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fileds,file) {
        try {
            if (!fileds.username[0]){
                throw new Error('请输入用户名');
            }
        }
        catch (e) {
            res.json({"status":'203',
                "msg":e.message});
            return res.end();
        }

        userModels.findOneUsername(fileds.username[0])
            .then(function (result) {
                try {
                    if (!result) {
                        throw new Error('用户不存在')
                    }
                    if (sha1(fileds.password[0])!=result.password) {
                        throw new Error('用户名或密码错误')
                    }
                }
                catch (e) {
                    res.json({"status":'201',
                        "msg":e.message});
                    return res.send();
                }
                delete result.password;
                delete result._id;

                req.session.user=result;

                powerModels
                    .getPowerByuserId(result.userId.toString())
                    .then(function (result) {

                        req.session.power=result;
                        res.json({"status":'200',
                            "msg":'登陆成功'});
                        return res.send();
                    })

            })
    })
})

module.exports=router;