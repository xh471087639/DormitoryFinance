const config=require('config-lite')(__dirname);
const path=require('path');
const fs=require('fs');
const multiparty=require('multiparty');
const mongodb= require('mongodb');
const express=require('express');
const userModels=require('../models/user');
const dormitoryModels=require('../models/dormitory');
const powerModels=require('../models/power');
const userMessageModels=require('../models/userMessage');

let router=express.Router();

router.get('/',function (req,res,next) {
    res.sendFile(path.resolve('./views/html/DormitoryManagement.html'));
})
router.get('/findDormitory.html',function (req,res,next) {
    res.sendFile(path.resolve('./views/html/findDormitory.html'));
})

router.post('/createDormitory',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!fields.dormitoryName[0]){
                throw new Error('请输入宿舍名');
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }

        userModels.findOneUserById(req.session.user.userId)
            .then(function (result) {
                try {
                    if (result.dormitoryId){
                        throw new Error('已有宿舍');
                    }
                }catch (e) {
                    res.json({
                        'status':'202',
                        'msg':e.message
                    })
                    return res.send();
                }

                let dormitory={
                    dormitoryName:fields.dormitoryName[0],
                    dormitoryMenber:req.session.user.userId.toString(),
                    dormitoryDistribution:'1',
                }
                let power={
                    userId:req.session.user.userId.toString(),
                    read:true,
                    create:true,
                    update:true,
                    delete:true,
                }
                dormitoryModels.createDormitory(dormitory)
                    .then(function (result) {
                        if (result){
                            userModels.addDormitoryId(req.session.user.userId,result.ops[0].dormitoryId.toString());
                            powerModels.createPower(power);
                        }
                    });


                res.json({
                    'status':'200',
                    'msg':'成功创建宿舍'
                })
                return res.send();

            })




    })
})

router.post('/transferOfAuthority',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        let aimUserId='';
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!fields.aimName[0]){
                throw new Error('请选择转让对象');
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        userModels.findOneUsername(fields.aimName[0])
            .then(function (result) {
                try {
                    if (!result){
                        throw new Error('该用户还未创建账号');
                    }
                }catch (e) {
                    res.json({
                        'status':'203',
                        'msg':e.message
                    })
                    return res.send();
                }
                aimUserId=result.userId;
            })
        dormitoryModels.dormitoryInformationByuserId(req.session.user.userId)
            .then(function (result) {
                try {
                    if (!result){
                        throw new Error('请先创建你的宿舍');
                    }
                    if (!result.menber.indexOf(aimUserId)==-1){
                        throw new Error('您的宿舍无此人，请核对后重试');
                    }
                }catch (e) {
                    res.json({
                        'status':'202',
                        'msg':e.message
                    })
                    return res.send();
                }
                powerModels.getPowerByuserId(req.session.user.userId)
                then(function (result) {
                    try {
                        if (result.delete && result.update && result.create){
                            throw new Error('您不具有管理权限，无法转让');
                        }
                    }catch (e) {
                        res.json({
                            'status':'202',
                            'msg':e.message
                        })
                        return res.send();
                    }
                    powerModels.transferOfAuthority(req.session.user.userId,aimUserId)
                    res.json({
                        'status':'200',
                        'msg':'成功转让权限'
                    })
                    return res.send();
                })


            })




    })
})

router.post('/updataInformation',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        let information={};
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!fields.dormitoryName && !fields.dormitoryDistribution){
                throw new Error('请写入需要更新的信息');
            }else {
                if (fields.dormitoryName) {
                    information.dormitoryName=fields.dormitoryName[0]
                }
                if (fields.dormitoryDistribution) {
                    information.dormitoryDistribution=fields.dormitoryDistribution[0]
                }
            }
        }catch (e) {
            console.log(e);
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }


        dormitoryModels
            .updataInformation(req.session.user.dormitoryId,information)
            .then(function (result) {
                res.json({
                    'status':'200',
                    'msg':'信息更新成功',
                    'dormitory':{
                        'dormitoryName':result.dormitoryName,
                        'dormitoryDistribution':result.dormitoryDistribution,
                    },
                })
                return res.send();
            })

    })

})

router.post('/invitationToJoin',function (req,res,next) {
    let form = new multiparty.Form();
    form.parse(req, function (err, fields, file) {
        let dormitoryName='';
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!req.session.user.dormitoryId){
                throw new Error('您还未加入宿舍');
            }
            if (!fields.aimName[0]){
                throw new Error('请选择邀请对象');
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        dormitoryModels
            .dormitoryInformationById(req.session.user.dormitoryId)
            .then(function (result) {
                dormitoryName=result.dormitoryName;
                userModels.findOneUsername(fields.aimName[0])
                    .then(function (result) {
                        let messageInformation={};
                        let havePower=false;
                        let aimId=result.userId;
                        let messageIdQueue='';
                        result.messageIdQueue?messageIdQueue=result.messageIdQueue+',':messageIdQueu='';
                        powerModels
                            .getPowerByuserId(req.session.user.userId)
                            .then(function (result) {
                                havePower=result.delete;
                                try {
                                    if (!result.userId){
                                        throw new Error('查无此用户');
                                    }
                                    if (!havePower){
                                        throw new Error('您不是宿舍长，无邀请权限');
                                    }
                                }catch (e) {
                                    res.json({
                                        'status':'202',
                                        'msg':e.message
                                    })
                                    return res.send();
                                }


                                console.log(req.session);
                                messageInformation.type='invitation';
                                messageInformation.title='您收到一则邀请';
                                messageInformation.detail=req.session.user.username+'邀请您加入'+dormitoryName;
                                messageInformation.inviteDormitoryId=req.session.user.dormitoryId;

                                userMessageModels
                                    .createMessage(messageInformation)
                                    .then(function (result) {
                                        userModels.updateMessage(aimId,messageIdQueue+ result.ops[0].messageId.toString())
                                            .then(function () {
                                                res.json({
                                                    'status':'200',
                                                    'msg':'成功发送邀请，请等待对方确认'
                                                })
                                                return res.send();
                                            })
                                    })
                            })


                    })

            })
            })

})



module.exports=router;