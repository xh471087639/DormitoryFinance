const dormitoryCost=require('../lib/mongo').dormitoryCost;

module.exports={
    createDormitoryCost:function (costInformation) {
        return dormitoryCost
            .create(costInformation)
            .exec();
    },
    deleteDormitoryCost:function (dormitoryCostId,dormitoryId) {
        let end;

        for (let dci of dormitoryCostId){
            end=dormitoryCost
                .remove({_id:dci.toString(),dormitoryId:dormitoryId})
                .exec();

        }
        return end;
    },
    findDormitoryCost:function (dormitoryCostId) {
        return dormitoryCost
            .find({_id:dormitoryCostId})
            .exec();
    },
    findCostByDormitory:function (dormitoryId,page) {
        return dormitoryCost
            .find({dormitoryId:dormitoryId})
            .limit(10)
            .skip((page-1)*10)
            .exec();
    },
    batchUploadDormitoryCost:function (main,dormitoryId) {
        let end;
        let x=2;
        for(let i of main){
            let obj={
                money:i[0].toString(),
                time:i[1].toString(),
                notes:i[2],
                menber:i[3],
                dormitoryId:dormitoryId
            }

            end=dormitoryCost
                .insert(obj)
                .exec();
        }
        return end;
    }
}