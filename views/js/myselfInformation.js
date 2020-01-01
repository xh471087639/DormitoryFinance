$(document).ready(function () {


    let myselfInformation=new Vue({
        el:'#main',
        data: {
            edit:false,
            modal:{
                modalHead:'',
                modalInput:'',
                sureAim:'',
                modalInputValue:'',
            },
            processInformations:{
                title:'',
                detail:'',
                time:'',
                messageId:'',
            },
            financial:{
                money:'',
                time:'',
                notes:'',
                menber:'',
            },
            getAllFinancial:[],

            username:'LaLaLa',
            name:'夏浩',
            title:'啦啦啦啦啦',
            detail:'哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或',
            time:'2017/12/19',
            dormitoryName:'',
            dormitoryMember:'',
            dormitoryIdentity:'',
            mail:'471087639@qq.com',
            sex:'male',
            headImg:'',
            dormitoryId:'',
            messages:[],
            checkedFinancial:[],
            checkedMessage:[],
            file:{},

            page:0,
            inMessage:false,
            inDormitory:false,
            inMyselfInformation:false,
            inFinancial:true,
            inNewLocalFinancial:false,
            choseAll:false,
            choseExcel:false,
        },
        methods:{
            branchExecution:function () {
                console.log('a',this.modal.sureAim);
                this.modal.sureAim?this[this.modal.sureAim](this.modal.modalInputValue):void (0);
            },
            getMyselfInformation:function () {
                let that=this;
                let formdata=new FormData();
                // formdata.append('username',this.username);
                // formdata.append('password',this.password);
                new Interactive({
                    childPath:'/informationManagement/getMyselfInformation',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        that.name=result.msg.name;
                        that.username=result.msg.username;
                        that.sex=result.msg.sex;
                        that.mail=result.msg.mail;
                        result.msg.img?that.headImg=result.msg.img:void (0);
                        if (result.msg.dormitoryId){
                            that.dormitoryId=result.msg.dormitoryId;
                            that.dormitoryIdentity=result.msg.dormitoryIdentity;
                            that.dormitoryMember=result.msg.dormitoryMemberName.join(',');
                        }

                    },
                    errorCallback:function () {

                    },
                }).init();
            },

            createDormitory:function (needDormitoryName) {
                let that=this;
                let formdata=new FormData();
                formdata.append('dormitoryName',needDormitoryName);
                // formdata.append('password',this.password);
                new Interactive({
                    childPath:'/informationManagement/createDormitory',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('创建宿舍'+needDormitoryName+'成功');
                        that.dormitoryName=needDormitoryName;
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',创建宿舍'+that.dormitoryName+'失败,请重试');
                    },
                }).init();
            },
            toInvitation:function(username){
                let that=this;
                let formdata=new FormData();
                formdata.append('aimName',username);
                // formdata.append('password',this.password);
                new Interactive({
                    childPath:'/informationManagement/invitationToJoin',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('成功对'+username+'发出邀请');
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',邀请失败,请重试');
                    },
                }).init();
            },
            transferOfAuthority:function(username){
                let that=this;
                let formdata=new FormData();
                formdata.append('aimName',username);
                // formdata.append('password',this.password);
                new Interactive({
                    childPath:'/informationManagement/transferOfAuthority',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('成功将权限转让给了'+username);
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',权限转让失败,请重试');
                    },
                }).init();
            },
            editDormitoryName:function(needDormitoryName){
                let that=this;
                let formdata=new FormData();
                formdata.append('dormitoryName',needDormitoryName);
                // formdata.append('password',this.password);
                new Interactive({
                    childPath:'/informationManagement/createDormitory',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('创建宿舍'+needDormitoryName+'成功');
                        that.dormitoryName=needDormitoryName;
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',创建宿舍'+that.dormitoryName+'失败,请重试');
                    },
                }).init();
            },
            getMyselfPower:function () {
                let that=this;
                let formdata=new FormData();
                // formdata.append('username',this.username);
                // formdata.append('password',this.password);
                new Interactive({
                    childPath:'/informationManagement/getMyselfInformation',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        that.name=result.msg.name;
                        that.username=result.msg.username;
                        that.sex=result.msg.sex;
                        that.mail=result.msg.mail;
                        result.msg.img?that.headImg=result.msg.img:void (0);
                        result.msg.dormitoryId?that.dormitoryId=result.msg.dormitoryId:void (0);


                    },
                    errorCallback:function () {

                    },
                }).init();
            },

            getMyselfMessage:function () {
                let that=this;
                let formdata=new FormData();
                formdata.append('password',this.password);

                new Interactive({
                    childPath:'/myselfManagement/getMessage',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        that.messages=result.message;
                        for (let i=0;i<that.messages.length;i++){
                            that.messages[i].time=that.convertToTime(that.messages[i].messageId);
                        }

                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+'个人消息查询失败,请重试');
                    },
                }).init();
            },
            processInformation:function(event){
                console.log(this);
                let that=this;
                let target;
                if (that.edit){

                }
                else {
                    console.log($(event.target));
                    $(event.target).attr('nodeName')=='DIV'?target=$(event.target):target=$(event.target).parent();
                    that.processInformations.messageId=target.attr('id');
                    console.log(that.processInformations)
                    that.processInformations=(function () {
                        for (let i of that.messages){
                            if (i.messageId==that.processInformations.messageId) {
                                return i;
                            }
                        }
                    })()

                    that.processInformations.type=='invitation'?$('#processInformation').modal('show'):void(0);
                }
            },
            confirmAccession:function(){
                let that=this;
                let formdata=new FormData();
                formdata.append('messageId',that.processInformations.messageId);
                formdata.append('dormitoryId',that.processInformations.inviteDormitoryId);
                new Interactive({
                    childPath:'/myselfManagement/confirmAccession',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('成功加入了该宿舍');
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+'加入宿舍失败,请重试');
                    },
                }).init();
            },
            confirmRefuse:function(){
                let that=this;
                let formdata=new FormData();
                formdata.append('messageId',that.processInformations.mssageId);
                formdata.append('dormitoryId',that.processInformations.inviteDormitoryId);
                new Interactive({
                    childPath:'/myselfManagement/confirmRefuse',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('已拒绝加入该宿舍');

                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+'个人消息查询失败,请重试');
                    },
                }).init();
            },

            addFinancial:function(){
                let formdata=new FormData();
                formdata.append('money',this.financial.money);
                formdata.append('time',this.financial.time);
                formdata.append('menber',this.financial.menber);
                formdata.append('notes',this.financial.notes);
                new Interactive({
                    childPath:'/financialManagement/addDormitoryCost',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('添加成功');
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',权限转让失败,请重试');
                    },
                }).init();
            },
            getFinancial:function(){
                let that=this;
                that.page++;
                let formdata=new FormData();
                formdata.append('page',that.page)
                new Interactive({
                    childPath:'/financialManagement/getDormitoryCost',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        for (let i of result.msg) {
                            that.getAllFinancial.push(i);
                        }


                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',权限转让失败,请重试');
                    },
                }).init();
            },
            deleteFinancial:function(){
                let formdata=new FormData();
                formdata.append('dormitoryCostId',this.checkedFinancial);
                new Interactive({
                    childPath:'/financialManagement/deleteDormitoryCost',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        PromptBox.displayPromptBox('删除成功');
                        setTimeout(function () {
                            window.location.href='myselfInformation.html'
                        },1000)
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',删除失败,请重试');
                    },
                }).init();
            },
            batchUpload:function(){
                let that=this;
                let formdata=new FormData();
                formdata.append('file',that.file);
                new Interactive({
                    childPath:'/financialManagement/batchUpload',
                    method:'POST',
                    detail:formdata,
                    successCallback:function (result) {
                        that.getAllFinancial=result.msg;
                    },
                    errorCallback:function (result) {
                        PromptBox.displayPromptBox('由于'+result.msg+',权限转让失败,请重试');
                    },
                }).init();
            },
            getDormitoryFinancialExample:function(){
                window.open(URL+'/financialManagement/getDormitoryFinancialExampleFile');
            },
            

            convertToTime:function (objectId) {
                let bytes = [];
                for (let i = 0; i < 4; i++) {
                    bytes[i] = parseInt(objectId.substring(i * 2, i * 2 + 2), 16);
                }
                let int = (((bytes[0]) << 24) |
                    ((bytes[1] & 0xff) << 16) |
                    ((bytes[2] & 0xff) << 8) |
                    ((bytes[3] & 0xff))); //位移操作 加上括号；
                let times = int*1000; //创建时间的 毫秒数  自己就可以转化了
                let date= new Date(times).toLocaleString('chinese',{hour12:false})
                return date;
            },
            checkedAll:function (event) {
                this.choseAll=!this.choseAll;
                console.log(this.choseAll)
                if (this.inFinancial) {
                    if (this.choseAll){
                        for (let i of this.getAllFinancial) {
                            this.checkedFinancial.push(i._id);
                        }
                    } else {
                        this.checkedFinancial=[];
                    }
                }else{
                    if (this.choseAll){
                        for (let i of this.messages) {
                            this.checkedMessage.push(i.messageId);
                        }
                    } else {
                        this.checkedMessage=[];
                    }

                }

            },
            choseFile:function (event) {
                let file = event.target.files[0];
                this.file=file;
                console.log(this.file);
            }
        },
        mounted:function () {
          this.getMyselfInformation();
          this.getMyselfMessage();
          this.getFinancial();
        },
    })
})