const config=require('config-lite')(__dirname);
const path=require('path');
const fs=require('fs');
const multiparty=require('multiparty');
const mongodb= require('mongodb');
const express=require('express');
const excel=require('exceljs');
const xlsx = require('node-xlsx');


const userModels=require('../models/user');
const dormitoryModels=require('../models/dormitory');
const powerModels=require('../models/power');
const userMessageModels=require('../models/userMessage');
const dormitoryCostModels=require('../models/dormitoryCost');
console.log(path.resolve('./public/exampleFile/dormitoryFinancialExample.xlsx'))

const router=express.Router();


router.get('/',function (req,res,next) {
    res.sendFile(path.resolve('./views/html/financialManagement.html'));
})

router.post('/addDormitoryCost',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,file) {

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
            if (!req.session.power.delete){
                throw new Error('您没有删除权限');
            }
        }catch (e) {
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        let msg;
        let dormitoryCostId=fields.dormitoryCostId[0].split(',');
        dormitoryCostModels
            .deleteDormitoryCost(dormitoryCostId,req.session.user.dormitoryId.toString())
            .then(function (result) {
                res.json({
                    'status':'200',
                    'msg':'已进行删除'
                })
                return res.send();
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
                fields.page?page=parseInt(fields.page[0]):void (0);
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

                        res.json({
                            'status':'200',
                            'msg':result
                        })
                        return res.send();


            })


    })
})

router.post('/batchUpload',function (req,res,next) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,files) {
        let page=1;
        try {
            if (!req.session.user.userId){
                throw new Error('请先登录');
            }
            if (!req.session.user.dormitoryId){
                throw new Error('您还未加入宿舍');
            }

        }catch (e) {
            fs.unlink(files.file[0].path);
            res.json({
                'status':'203',
                'msg':e.message
            })
            return res.send();
        }
        let excel=xlsx.parse(files.file[0].path)[0].data;
        let headTitle=excel.shift();
        if (headTitle[0]!='收入/支出'||headTitle[1]!='日期'||headTitle[2]!='备注'||headTitle[3]!='对象成员'){
            res.json({
                'status':'202',
                'msg':'您的样例文件不正确，无法处理，请重新下载最新的样例'
            })
            return res.send();
        }else {
            dormitoryCostModels
                .batchUploadDormitoryCost(excel,req.session.user.dormitoryId)
                .then(function (result) {
                    fs.unlink(files.file[0].path,function () {
                        res.json({
                            'status':'200',
                            'msg':'已进行数据导入'
                        })
                        return res.send();
                    });
                })
        }
        


    })
})

router.get('/getDormitoryFinancialExampleFile',function (req,res,next) {

    var name = 'dormitoryFinancialExample.xlsx';
    var path = './public/exampleFile/dormitoryFinancialExample.xlsx';
    var size = fs.statSync(path).size;
    var f = fs.createReadStream(path);
    res.writeHead(200, {
        'Content-Type': 'application/force-download',
        'Content-Disposition': 'attachment; filename=' + name,
        'Content-Length': size
    });
    f.pipe(res);

})


module.exports=router;