const dormitory=require('../lib/mongo').dormitory;

module.exports={
    createDormitory:function (dormitoryInformation) {
        return dormitory
            .create(dormitoryInformation)
            .exec();
    },
    dormitoryInformationByuserId:function (userId) {
        return dormitory
            .findOne({dormitoryMenber: userId})
            .exec();
    },
    updataInformation:function (dormitoryId,information) {
        return dormitory
            .update({dormitoryId:dormitoryId},{$set:information})
            .exec();
    },
    dormitoryInformationById:function (dormitoryId) {
        return dormitory
            .findOne({dormitoryId:dormitoryId})
            .exec();
    },

}