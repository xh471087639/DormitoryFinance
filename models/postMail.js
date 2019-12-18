const config=require('config-lite')(__dirname);
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


// 开启一个 SMTP 连接池
let transport = nodemailer.createTransport(smtpTransport({
    host: config.email.host, // qq邮箱主机
    secure: true, // 使用 SSL
    secureConnection: true, // 使用 SSL
    // port: config.email.port, // SMTP 端口
    auth: {
        user: config.email.user, // 账号   你自定义的域名邮箱账号
        pass: config.email.pass    // 密码   你自己开启SMPT获取的密码
    }
}));

//  发送邮件路由

    let mailOptions = {
        from: '<'+config.email.user+'>', // 发件地址
        to: '', // 收件列表
        subject: "邮箱秘钥", // 标题
        text:"",
        html:'',
    }
    // 发送邮件
    let sendMail=function (){
        console.log(mailOptions);
        transport.sendMail(mailOptions, function(error, response) {
            if(error){
                console.log("fail: " + error);
                console.log("发送失败");
            }else{

            }
            transport.close(); // 如果没用，关闭连接池
        });
    }
module.exports={
    mailOptions:mailOptions,
    sendMail:sendMail,
}