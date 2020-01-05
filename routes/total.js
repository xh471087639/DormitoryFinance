const config=require('config-lite')(__dirname);
const express=require('express');
const session=require('express-session');

const app=express();

app.use(session(config.mailSession));
app.use('/regist',require('./regist'));
app.use(session(config.session));
app.use('/index',require('./index'));
app.use('/informationManagement',require('./informationManagement'));
app.use('/login',require('./login'));
app.use('/myselfInformation',require('./myselfManagement'));
app.use('/financialManagement',require('./financialManagement'));

module.exports=app;