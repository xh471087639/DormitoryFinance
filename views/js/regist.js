$(document).ready(function () {
    let CreateRegistFunction=function (allId) {
        this.AllowRegistration=[false,false,false,false,false,false];
        this.time=0;
        this.id=allId||[];
    };

    let RegistFunction=new CreateRegistFunction(['Name','Sex','Email','Password','Passwords','EmailKey']);

    (function main() {

        $('.RegistInput').blur(function () {
            let innervalue=event.path[0].value;
            console.log(event.path[0].id);
            RegistFunction.DetectionAll(event.path[0].id,innervalue,true);

        })
        $('#ToRegist').click(function () {
            let Status=true;
            for (let i=0;i<6;i++ ){
                RegistFunction.DetectionAll(RegistFunction.id[i],$('#'+RegistFunction.id[i]).val(),false);
            }
            for (let i of RegistFunction.AllowRegistration){
                Status=Status && i;
                console.log(Status);
            }
            $('#ToRegist').addClass('rubberBand');

            if (Status){
                RegistFunction.regist();
                $('#ToRegist').on('animationend',function () {
                    $('#ToRegist').removeClass('rubberBand')
                })
            } else {
                PromptBox.displayPromptBox('您有信息未填写或者填写有误');
                $('#ToRegist').on('animationend',function () {
                    $('#ToRegist').removeClass('rubberBand')
                })
            }
        })
        $('#GetEmailKey').click(function (){
            RegistFunction.getEmailKey.call(RegistFunction);
        })
        $('.registInnerBody>div>input').on('keypress',function () {
            if (event.keyCode==13){
                $('#ToRegist').click();
            }
        })

    })()

   let regist = new Vue({
       el: '#registBody',
       data: {
           username: '',
           password:'',
           name:'',
           sex:'male',
           mail:'',
           mailKey:'',
           agree:false,
           allowCountdown:0,
       },
       methods:{
           DetectionSymbol:function (value) {
               let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
               let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

               if(regEn.test(value) || regCn.test(value)) {

                   return false;
               }else {
                   return true;
               }
           },
           DetectionNum:function(value){
               if (value.length>=6&&value.length<=18) {
                   return true;
               }else {
                   if (value.length>18) {
                       PromptBox.displayPromptBox('输入超过18个字符，请重新输入');
                       return false;
                   }else {
                       PromptBox.displayPromptBox('账号密码小于6个字符，请重新输入');
                       return false;
                   }

               }
           },
           DetectionLength:function(value,min,length){
               if (value.length>min&&value.length<=length){
                   return true;
               } else {
                   return false;
               }
           },
           DetectionEmail:function (str){
               var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
               return reg.test(str);
           },

           DetectionAll:function(id,innervalue,alert){
               switch (id) {
                   case 'Name':(function () {
                       if (innervalue.length>1&&innervalue.length<5&& RegistFunction.DetectionSymbol(innervalue)){
                           RegistFunction.AllowRegistration[0]=true;
                       } else {
                           RegistFunction.AllowRegistration[0]=false;
                           !alert?void (0):PromptBox.displayPromptBox('请输入正确的姓名');
                       }
                   })();break;
                   case 'Sex':(function () {
                       console.log(innervalue);
                       if (innervalue){
                           RegistFunction.AllowRegistration[1]=true;
                       } else {
                           RegistFunction.AllowRegistration[1]=false;
                           !alert?void (0):PromptBox.displayPromptBox('请选择性别');
                       }
                   })();break;
                   case 'Password':(function () {
                       if (RegistFunction.DetectionSymbol(innervalue)&&RegistFunction.DetectionNum(innervalue)){
                           RegistFunction.AllowRegistration[2]=true;
                       } else {
                           RegistFunction.AllowRegistration[2]=false;
                           !alert?void (0):PromptBox.displayPromptBox('请输入正确的密码');
                       }
                   })();break;
                   case 'Passwords':(function () {
                       if (document.getElementById('Password').value==document.getElementById('Passwords').value){
                           RegistFunction.AllowRegistration[3]=true;
                       } else {
                           RegistFunction.AllowRegistration[3]=false;
                           !alert?void (0):PromptBox.displayPromptBox('两次密码不一致');
                       }
                   })();break;
                   case 'Email':(function () {
                       console.log(innervalue);
                       if (RegistFunction.DetectionEmail(innervalue)){
                           RegistFunction.AllowRegistration[4]=true;
                       } else {
                           RegistFunction.AllowRegistration[4]=false;
                           !alert?void (0):PromptBox.displayPromptBox('请输入正确的邮箱');
                       }
                   })();break;
                   case 'EmailKey':(function () {
                       if (innervalue){
                           RegistFunction.AllowRegistration[5]=true;
                       } else {
                           RegistFunction.AllowRegistration[5]=false;
                           !alert?void (0):PromptBox.displayPromptBox('请输入验证码');
                       }
                   })();break;
               }
           },

           checkUserName:function () {
               let checkEnd=this.DetectionSymbol(this.username)&&this.DetectionLength(this.username,4,16);
               if (!checkEnd){
                   PromptBox.displayPromptBox("用户名输入错误(字符数在4-16内，无特殊字符)");
                   return false;
               } else{
                   return true ;
               }
           },
           checkPassword:function(){
               let checkEnd=this.DetectionLength(this.password,8,16);
               if (!checkEnd){
                   PromptBox.displayPromptBox("密码输入错误(字符数在8-16内)");
                   return false;
               } else{
                   return true ;
               }
           },
           checkMail:function(){
               let checkEnd=this.DetectionEmail(this.mail);
               if (!checkEnd){
                   PromptBox.displayPromptBox("邮箱输入错误");
                   return false;
               } else{
                   return true ;
               }
           },
           checkName:function(){
               let checkEnd=this.DetectionLength(this.name,1,8);
               if (!checkEnd){
                   PromptBox.displayPromptBox("姓名输入错误(字符数在2-8内)");
                   return false;
               } else{
                   return true ;
               }
           },
           checkMailKey:function(){
               let checkEnd=this.DetectionLength(this.mailKey,4,6);
               if (!checkEnd){
                   PromptBox.displayPromptBox("邮箱验证码长度错误");
                   return false;
               } else{
                   return true ;
               }
           },


           getEmailKey:function(event){
                let checkEnd=this.checkMail()&&!this.allowCountdown;
               if (checkEnd){
                   let form=new FormData();
                   form.append('email',this.mail);
                   new Interactive({
                       childPath:'/regist/getMailKey',
                       method:'GET',
                       detail:form,
                       successCallback:function (result) {
                           (function () {
                               this.allowCountdown=30;
                               let IntvId=setInterval(function () {
                                   if (this.allowCountdown>0){
                                       this.allowCountdown--;
                                       $(event.target).val(this.allowCountdown+'s后可获取验证码');
                                   }else {
                                       $(event.target).val('获取验证码');
                                       window.clearInterval(IntvId);
                                   }
                               },1000)
                           })()
                       },
                       errorCallback:function () {
                       },
                   }).init();

               }
               else {
                   this.checkMail()==true&&!this.allowCountdown==false?PromptBox.displayPromptBox("获取过于频繁，请稍后再试"):void (0);
               }
           },
           regist:function() {
               let checkEnd=this.checkMail()&&this.checkUserName()&&this.checkPassword()&&this.checkMailKey()&&this.checkName();
               if (checkEnd){
                   let formdata=new FormData();
                   formdata.append('username',this.username);
                   formdata.append('name',this.name);
                   formdata.append('password',this.password);
                   formdata.append('mail',this.mail);
                   formdata.append('sex',this.sex);
                   formdata.append('mailKey',this.mailKey);
                   new Interactive({
                       childPath:'/regist/',
                       method:'POST',
                       detail:formdata,
                       successCallback:function (result) {
                           PromptBox.displayPromptBox('注册成功');
                           setTimeout(function () {
                               window.location='login.html'
                           },3000)

                       },
                       errorCallback:function () {

                       },
                   }).init();
               }


           },
           toLogin:function () {
               window.location.href='login.html';
           }
       },

    })


})