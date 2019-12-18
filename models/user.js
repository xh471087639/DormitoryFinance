const user=require('../lib/mongo').user;

module.exports={
    checkMail:function (mail) {
        let re=/^\w[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})$/i;
        if (re.test(mail)){
            return true;
        } else{
            return false;
        }
    },
    createUser:function (userInformation) {
        return user
            .create(userInformation)
            .exec();
    },
    findUser:function (username) {
        return user
            .find({username:username})
            .exec();
    },
    findOneUsername:function (username) {
        return user
            .findOne({username:username}, {username:1})
            .exec();

    },
    findOneUserById:function(userId){
        return user
            .findOne({userId:userId})
            .exec();
    },
    addDormitoryId:function (userId,dormitoryId) {
        return user
            .update({userId:userId}, {$set:{dormitoryId:dormitoryId}})
            .exec();
    },
    updateMessage:function (userId,messageIdQueue) {
        return user
            .update({userId:userId},{$set:{messageIdQueue:messageIdQueue}})
            .exec();
    },
    updataUserDormitory:function (userId,dormitoryId) {
        return user
            .update({userId:userId},{$set:{dormitoryId:dormitoryId}})
            .exec();
    }

}