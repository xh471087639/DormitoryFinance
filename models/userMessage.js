const userMessage=require('../lib/mongo').userMessage;

module.exports={
    createMessage:function (userMessageInformation) {
        return userMessage
            .create(userMessageInformation)
            .exec();
    },
    findUserMessage:function (MessageId) {
        return userMessage
            .findOne({messageId: MessageId})
            .exec();
    },
    updataMessage:function (MessageId,information) {
        return userMessage
            .update({messageId: MessageId},{$set:information})
    }
}