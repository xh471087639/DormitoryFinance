const config=require('config-lite')(__dirname);
const path=require('path');
const fs=require('fs');
const express=require('express');
const session=require('express-session');
const routes=require('./routes')

const app=express();
app.use(express.static('public'));
app.use(express.static('views'));
// app.use(session(config.session));

app.use('/',require('./routes/total'));
app.set('view engine', 'html');
app.set('views', './views/html');


app.listen(config.port,function () {
    console.log(`DormitoryFinance listening on port ${config.port}`)
})
