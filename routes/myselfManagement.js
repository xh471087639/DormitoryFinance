const config=require('config-lite')(__dirname);
const path=require('path');
const fs=require('fs');
const sha1=require('sha1');
const multiparty=require('multiparty');
const express=require('express');
const userModels=require('../models/user');
const userMessage=require('../models/userMessage');
const dormitory=require('../models/dormitory');
const powerModels=require('../models/power');

const router=express.Router();

router.get('/',function (req,res,next) {
    res.sendFile(path.resolve('./views/html/regist.html'));
})

router.get('/',function (req,res,next) {
    res.render('myselfManagement', {title: 'HTML'});
})

router.post('/getMessage',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {

        let page=1;
        let list=3;
        let message=[];
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        let messageIdQueue=[];
        fields!=undefined?fields.page!=undefined?page=fields.page[0]:void(0):void(0);
        if (req.session.user.messageIdQueue!=undefined) {
            messageIdQueue=req.session.user.messageIdQueue.split(',');

            if((messageIdQueue.length/3)<1){

                list=messageIdQueue.length;
            }
        }else{
            list=0;
        }
        let promise=new Promise(function (resolve, reject) {
            for (let i=0;i<list;i++){

                if (i==list-1){
                    userMessage
                        .findUserMessage(messageIdQueue[3*(page-1)+list])
                        .then(function (result) {
                            let oneMessage=result;
                            console.log(result);
                            message.push(oneMessage);
                            resolve();
                        })
                }else {
                    userMessage
                        .findUserMessage(messageIdQueue[3*(page-1)+list])
                        .then(function (result) {
                            let oneMessage=result;
                            console.log(result);
                            message.push(oneMessage);
                        })
                }
            }

        });
        promise
            .then(function (resolve, reject) {
                res.json({
                    'status':'200',
                    'msg':'成功获取个人消息',
                    'message':message
                })
                return res.send();
                resolve();
            })


    })
})

router.post('/confirmAccession',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (req.session.user.dormitoryId){
                throw new Error('您已经有宿舍了，请先退出该宿舍');
            }
            if (!fields){
                throw new Error('请求为空无法加入');
            } else {
                if (!fields.messageId){
                    throw new Error('未找到邀请函');
                }
                if (!fields.dormitoryId){
                    throw new Error('未找到加入对象');
                }
                if (!req.session.user.messageIdQueue){
                    throw new Error('您未收到该邀请函');
                }
                if (req.session.user.messageIdQueue.split(',').indexOf(fields.messageId[0])){
                    throw new Error('您未持有该邀请函');
                }
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        let promise=new Promise(
            function (resolve, reject) {
            userMessage
                .findUserMessage(fields.messageId[0])
                .then(function (result) {
                    console.log(result);
                    try {
                        if (!result){
                            throw new Error('未找在库中找到邀请函');
                        }
                        if (result.inviteDormitoryId!=fields.dormitoryId[0]){
                            throw new Error('邀请目标与加入目标不一致');
                        }
                        if (result.type!='invitation'){
                            throw new Error('消息类型错误');
                        }
                    }catch (e) {
                        res.json({
                            'status':'202',
                            'msg':e.message
                        })
                        reject();
                        return res.send();
                    }
                    resolve({});
                })
        }
        )

        promise
            .then(
                function (data){
                return new Promise(function (resolve, reject) {
                    dormitory.dormitoryInformationById(fields.dormitoryId[0])
                        .then(function (result) {
                            try {
                                if (!result.dormitoryName){
                                    throw new Error('未找到该宿舍');
                                }else {
                                    resolve(result) ;
                                }
                            }catch (e) {
                                res.json({
                                    'status':'202',
                                    'msg':e.message
                                })
                                return res.send();
                            }
                        })
                })
            }
            )
            .then(
                function (data) {
                return new Promise(function (resolve,reject) {
                    userModels
                        .updataUserDormitory(req.session.user.userId,fields.dormitoryId[0]);
                    console.log(data);
                    dormitory
                        .updataInformation(fields.dormitoryId[0],{dormitoryMenber:data.dormitoryMenber+','+req.session.user.userId});

                    userMessage
                        .updataMessage(fields.messageId[0],{
                            type:'processed',
                            detail:'您已同意加入该宿舍'
                        });

                    powerModels
                        .createPower({
                            userId:req.session.user.userId,
                            read:true,
                            create:false,
                            update:false,
                            delete:false
                        })


                    res.json({
                        'status':'200',
                        'msg':'成功加入宿舍'
                    })
                    resolve();
                    return res.send();
                })
            }
            )

    })
})

router.post('/confirmRefuse',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!fields){
                throw new Error('请求为空无法加入');
            } else {
                if (!fields.messageId){
                    throw new Error('未找到邀请函');
                }
                if (!fields.dormitoryId){
                    throw new Error('未找到加入对象');
                }
                if (!req.session.user.messageIdQueue){
                    throw new Error('您未收到该邀请函');
                }
                if (req.session.user.messageIdQueue.split(',').indexOf(fields.messageId[0])){
                    throw new Error('您未持有该邀请函');
                }
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        let promise=new Promise(
            function (resolve, reject) {
                userMessage
                    .findUserMessage(fields.messageId[0])
                    .then(function (result) {
                        console.log(result);
                        try {
                            if (!result){
                                throw new Error('未找在库中找到邀请函');
                            }
                            if (result.inviteDormitoryId!=fields.dormitoryId[0]){
                                throw new Error('邀请目标与加入目标不一致');
                            }
                            if (result.type!='invitation'){
                                throw new Error('消息类型错误');
                            }
                        }catch (e) {
                            res.json({
                                'status':'202',
                                'msg':e.message
                            })
                            reject();
                            return res.send();
                        }
                        resolve({});
                    })
            }
        )

        promise
            .then(
                function (data){
                    return new Promise(function (resolve, reject) {
                        dormitory.dormitoryInformationById(fields.dormitoryId[0])
                            .then(function (result) {
                                try {
                                    if (!result.dormitoryName){
                                        throw new Error('未找到该宿舍');
                                    }else {
                                        resolve(result) ;
                                    }
                                }catch (e) {
                                    res.json({
                                        'status':'202',
                                        'msg':e.message
                                    })
                                    return res.send();
                                }
                            })
                    })
                }
            )
            .then(
                function (data) {
                    return new Promise(function (resolve,reject) {
                        userMessage
                            .updataMessage(fields.messageId[0],{
                                type:'processed',
                                detail:'您已拒绝加入该邀请'
                            })


                        res.json({
                            'status':'200',
                            'msg':'已拒绝该邀请'
                        })
                        resolve();
                        return res.send();
                    })
                }
            )

    })
})

module.exports=router;