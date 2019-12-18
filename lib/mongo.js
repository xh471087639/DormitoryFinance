const config = require('config-lite')(__dirname);
// const linkMongo=require('../config/production');
const Mongolass = require('mongolass');
const mongodb= require('mongodb');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const mongolass = new Mongolass();
mongolass.connect(config.mongodb)

mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

exports.user = mongolass.model('user', {
    userId: { type: Mongolass.Types.ObjectId ,default:new mongodb.ObjectId() },
    username: { type: 'string', required: true },
    mail: { type: 'string', required: true },
    password: { type: 'string', required: true },
    sex:{type:'string',enum:["male","female","none"],default:"none"},
    name: { type: 'string', required: true },
    img: { type: 'string' },
    dormitoryId:{type: 'string'},
    messageIdQueue:{type: 'string'},
})
exports.user.index({ userId: 1 },{unique:true}).exec()

exports.userMessage = mongolass.model('userMessage', {
    messageId: { type: Mongolass.Types.ObjectId ,default:mongodb.ObjectId()},
    type:{type:'string',enum:["normal","invitation","request","processed"],default:"normal"},
    title:{ type: 'string', required: true },
    detail:{ type: 'string', required: true },
    inviteDormitoryId:{type: 'string'},
})
exports.userMessage.index({ messageId: 1 },{unique:true}).exec()

exports.power = mongolass.model('power',{
    powerId:{type:Mongolass.Types.ObjectId ,default:mongodb.ObjectId()},
    userId:{type:'string',required:true,unique:true},
    read:{type:'boolean',required:true,default:true},
    create:{type:'boolean',required:true,default:false},
    update:{type:'boolean',required:true,default:false},
    delete:{type:'boolean',required:true,default:false},

})
exports.power.index({ powerId: 1 }, { unique: true }).exec()

exports.dormitoryCost = mongolass.model('dormitoryCost', {
    dormitoryCostId: { type: Mongolass.Types.ObjectId ,default:mongodb.ObjectId() },
    dormitoryId:{type:'string',require:true},
    time: { type: 'string', required: true },
    money: { type: 'string', required: true },
    menber: { type: 'string', required: true },
    notes: { type: 'string' },
})
exports.dormitoryCost.index({ dormitoryId: 1 },{unique:true}).exec()

exports.dormitory = mongolass.model('dormitory', {
    dormitoryId: { type: Mongolass.Types.ObjectId ,default:mongodb.ObjectId() },
    dormitoryName: { type: 'string', required: true },
    dormitoryMenber: { type: 'string', required: true },
    dormitoryDistribution: { type: 'string', required: true ,default:'1' },
})
exports.dormitory.index({ dormitoryId: 1 },{unique:true}).exec()