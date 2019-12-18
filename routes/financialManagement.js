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
const dormitoryCostModels=require('../models/dormitoryCost');


const router=express.Router();


router.get('/',function (req,res,next) {
    res.sendFile(path.resolve('./views/html/financialManagement.html'));
})

router.post('/addDormitoryCost',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        console.log(req.session);
        let costInformation={
        };
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!req.session.user.dormitoryId){
                throw new Error('您还未加入宿舍');
            }else {
                costInformation.dormitoryId=req.session.user.dormitoryId;
            }
            if (!req.session.power.create){
                throw new Error('您没有对金额进行修改的权利');
            }
            if (!fields.money[0]){
                throw new Error('请输入金额');
            }else {
                costInformation.money=fields.money[0];
            }
            if (!fields.time[0]){
                throw new Error('请输入消费时间');
            }else {
                costInformation.time=fields.time[0];
            }
            if (fields.notes){
                costInformation.notes=fields.notes[0];
            }
            if (!fields.menber[0]){
                throw new Error('未找到对象成员');
            }else {
                costInformation.menber=fields.menber[0];
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }

        dormitoryCostModels
            .createDormitoryCost(costInformation)
            .then(function (result) {
                res.json({
                    'status':'200',
                    'msg':'添加财务变动成功'
                })
                return res.send();
            })
            .catch(function (e) {
                res.json({
                    'status':'202',
                    'msg':e.message
                })
                return res.send();
            })




    })
})

router.post('/deleteDormitoryCost',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!req.session.user.dormitoryId){
                throw new Error('您还未加入宿舍');
            }
            if (!fields.dormitoryCostId[0]){
                throw new Error('请输入要删除的财务变动id');
            }

        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }

        dormitoryCostModels
            .findDormitoryCost(mongodb.ObjectID(fields.dormitoryCostId[0]))
            .then(function (result) {
                try {
                    console.log(fields.dormitoryCostId[0],result.dormitoryId,req.session.user.dormitoryId)
                    if (result[0].dormitoryId!=req.session.user.dormitoryId){
                        throw new Error('您不是该宿舍的人员无权进行修改');
                    }
                    if (!req.session.power.delete){
                        throw new Error('您没有删除权限');
                    }
                } catch (e) {
                    res.json({
                        'status':'202',
                        'msg':e.message
                    })
                    return res.send();
                }
                dormitoryCostModels
                    .deleteDormitoryCost(fields.dormitoryCostId[0])
                    .then(function (result) {
                        console.log(result);
                        res.json({
                            'status':'200',
                            'msg':'添加财务变动成功'
                        })
                        return res.send();
                    })

            })


    })
})

router.post('/getDormitoryCost',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {
        let page=1;
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!req.session.user.dormitoryId){
                throw new Error('您还未加入宿舍');
            }
            if (fields){
                fields?page=fields.page[0]:void (0);
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }

        dormitoryCostModels
            .findCostByDormitory(req.session.user.dormitoryId,page)
            .then(function (result) {
                        console.log(result);
                        res.json({
                            'status':'200',
                            'msg':result
                        })
                        return res.send();


            })


    })
})

module.exports=router;