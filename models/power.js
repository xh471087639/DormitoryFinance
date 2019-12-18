const power=require('../lib/mongo').power;

module.exports={
    createPower:function (powerInformation) {
        return power
            .create(powerInformation)
            .exec();
    },
    getPowerByuserId:function (userId) {
        return power
            .findOne({userId:userId})
            .exec();
    },
    transferOfAuthority:function (userId,aimUserId) {
        power
            .update({userId:userId},{$set:{create:false,update:false,delete:false}})
            .exec();

        return power
            .update({userId:aimUserId},{$set:{create:true,update:true,delete:true}})
            .exec();

    },
}