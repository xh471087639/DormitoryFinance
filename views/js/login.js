$(document).ready(function () {
    let login = new Vue({
        el: '#body',
        data: {
            defaultName:'CluerBomder',
            username: 'LaLaLa',
            password:'123456789',
            img:''
        },
        methods:{
            DetectionSymbol:function (value) {
                let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
                    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

                if(regEn.test(value) || regCn.test(value)) {

                    return false;
                }else {
                    return true;
                }
            },
            DetectionLength:function(value,min,length){
                if (value.length>min&&value.length<=length){
                    return true;
                } else {
                    return false;
                }
            },

            checkUserName:function () {
                let checkEnd=this.DetectionSymbol(this.username)&&this.DetectionLength(this.username,4,16);
                if (!checkEnd){
                    PromptBox.displayPromptBox("用户名输入错误(字符数在4-16内，无特殊字符)");
                    return false;
                } else{
                    this.defaultName=this.username;
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
            toRegist:function(){
                window.location.href='regist.html';
            },
            login:function() {
                let checkEnd=this.checkUserName()&&this.checkPassword();
                if (checkEnd){
                    let formdata=new FormData();
                    formdata.append('username',this.username);
                    formdata.append('password',this.password);
                    new Interactive({
                        childPath:'/login/',
                        method:'POST',
                        detail:formdata,
                        successCallback:function (result) {
                            PromptBox.displayPromptBox('登陆成功');
                            setTimeout(function () {
                                window.location='myselfInformation.html'
                                // window.location='financialManagement.html'
                            },1000)

                        },
                        errorCallback:function () {

                        },
                    }).init();
                }


            },
        },

    })
})