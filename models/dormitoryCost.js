const dormitoryCost=require('../lib/mongo').dormitoryCost;

module.exports={
    createDormitoryCost:function (costInformation) {
        return dormitoryCost
            .create(costInformation)
            .exec();
    },
    deleteDormitoryCost:function (dormitoryCostId) {
        return dormitoryCost
            .remove({dormitoryCostId:dormitoryCostId})
            .exec();
    },
    findDormitoryCost:function (dormitoryCostId) {
        return dormitoryCost
            .find({dormitoryCostId:dormitoryCostId})
            .exec();
    },
    findCostByDormitory:function (dormitoryId,page) {
        return dormitoryCost
            .find({dormitoryId:dormitoryId})
            .limit(10)
            .skip((page-1)*10)
            .exec();
    }
}