const config=require('config-lite')(__dirname);
const path=require('path');
const fs=require('fs');
const sha1=require('sha1');
const multiparty=require('multiparty');
const express=require('express');
const userModels=require('../models/user');
const postMail=require('../models/postMail');

const router=express.Router();



console.log(config.mailSession);

router.get('/',function (req,res,next) {
    res.sendFile(path.resolve('./views/html/regist.html'));
})
router.post('/',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        console.log(fields,req.session.mailKey);
        try {
            if (!(fields.username[0].length >= 4 && fields.name[0].length <= 15)) {
                throw new Error('用户名请限制在 4-15 个字符')
            }
            if (['male', 'female', 'none'].indexOf(fields.sex[0]) === -1) {
                throw new Error('性别只能是 male、female 或者为默认none')
            }
            if (fields.password[0].length < 6) {
                throw new Error('密码至少 6 个字符')
            }
            if (userModels.checkMail(fields.mail[0])) {
                throw new Error('缺少邮箱，或邮箱不正确')
            }
            if (!(fields.name[0].length>1 && fields.name[0].length<11)){
                throw new Error('请输入正确的姓名 2-10个字符');
            }
            if (fields.mailKey[0]!=req.session.mailKey){
                throw new Error('邮箱秘钥错误');
            }
        } catch (e) {
            // 注册失败，异步删除上传的头像
            if (file.headImg){
                fs.unlink(file.headImg[0].path,function () {});
            }
            console.log(e);
            res.json({"status":'203',
                "msg":e.message});
            return res.end();
        }
        userModels
            .findOneUsername(fields.username[0])
            .then(function (result) {
                try {
                    if (Boolean(result)){
                        throw new Error('已存在该用户名，请重新输入')
                    }
                }catch (e) {
                    if (file.img[0]){
                        fs.unlink(file.headImg[0].path,function () {});
                    }
                    res.json({"status":'202',
                        "msg":e.message});
                    return res.send();
                }

                let user={
                    username:fields.username[0],
                    mail:fields.mail[0],
                    name:fields.name[0],
                    sex:fields.sex[0],
                    password:sha1(fields.password[0]),
                }
                file.img?user.img=file.img[0].path:void(0);

                userModels.createUser(user)
                    .then(function (result) {
                        try {

                        }catch (e) {
                            res.json({"status":'202',
                                "msg":e.message});
                            res.send();
                        }
                        res.json({"status":'200',
                            "msg":'注册成功'});
                        res.send();
                    })

            })


    })
})

router.get('/getMailKey',function (req,res,next) {
    console.log(req.query.email);
    try {
        if(req.session.mailKey){
            throw new Error('请求过于频繁');
        }
    } catch(e)
    {
        res.json({
            'status':'202',
            'msg':e.message,
        })
        return res.send();
    }
    let mailKey=Math.floor(Math.random()*100000);
    postMail.mailOptions.to=req.query.email;
    postMail.mailOptions.text='您的验证秘钥为'+mailKey;
    postMail.sendMail();
    req.session.mailKey=mailKey;
    res.json({
        'status':'200',
        'msg':'邮箱秘钥已经发送请注意查收'
    })
    return res.send();


    // let form=new multiparty.Form();
    // form.parse() ;
})
module.exports=router;