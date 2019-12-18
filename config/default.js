module.exports={
    port:6767,
    session:{
        secret: 'session',
        key: 'DF',
        maxAge: 36000000
    },
    mailSession:{
        secret: 'mailKey',
        key: 'MK',
        maxAge: 300000
    },
    email:{
            service: 'qq',
            user: '471087639@qq.com',
            // pass:'qnclhozrmwtlbifd',
            pass: 'plyxuyqsqmhqbhbi',
            host:'smtp.qq.com',
            port:'465'
        },
    mongodb: 'mongodb://localhost:27017/DormitoryFinance',
}