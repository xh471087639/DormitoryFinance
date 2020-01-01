// const URL='http://localhost:6767';
const URL='http://139.196.220.58:8321';

const fileURL='http://139.196.220.58:8321';

let CreatPromptBox =function(){
    let newNode=document.createElement('div');
    newNode.classList.add('PromptBox');
    newNode.style.display='none';
    document.body.appendChild(newNode);
    this.newNode=newNode;
}
CreatPromptBox.prototype.displayPromptBox=function(text){
    this.newNode.innerText=text;
    $(this.newNode).fadeIn(500);
    $(this.newNode).fadeOut(1500);
}

let PromptBox = new CreatPromptBox();
//————————————————————————————————交互用便捷模块————————————————————————————————
// 使用模板如下：
// let img=new FormData();
// img.append('detail',value);
// img.append('file',element.files[0]);
// new Interactive({
//     childPath:'/oss/uploadFile',
//     method:'PUT',
//     detail:img,
//     isFile:true,
//     successCallback:function (result) {
//          doSomething();
//     },
//     errorCallback:function () {
//          doSomething();
//     },
// }).init();


let Interactive=function (inf) {
    this.Path=inf.childPath;
    this.Method=inf.method||'POST';
    this.detail=inf.detail;
    this.successCallback=inf.successCallback;
    this.errorCallback=inf.errorCallback;
    this.isFile=inf.isFile||false;
    return this;
}
Interactive.prototype={
    init:function () {
        let that=this;
        that.isFile?that.Path=fileURL+that.Path:that.Path=URL+that.Path;
        console.log(that.detail);
        switch (that.Method.toLowerCase()) {
            case 'get':(function myGet(){
                let formdataEntrise=that.detail.entries();
                let form={};
                for (let i of formdataEntrise){
                    form[i[0]]=i[1];
                }

                $.ajax({
                    type: that.Method,
                    url: that.Path,
                    contentType: 'application/x-www-form-urlencoded',
                    dataType: 'json',
                    async: true,
                    data: form,
                    success: function (result) {
                        console.log(result);
                        that.copeResult(result);
                    },
                    error: function () {
                        PromptBox.displayPromptBox('联系不上服务器啦 - 3 - ');
                    }
                })
            })();break;
            default:$.ajax({
                type: that.Method,
                url: that.Path,
                contentType:false,
                dataType: 'json',
                processData:false,
                async: true,
                data: that.detail,
                success: function (result) {
                    console.log(result);
                    that.copeResult(result);
                },
                error: function () {
                    PromptBox.displayPromptBox('联系不上服务器啦 - 3 - ');
                }
            });break;
        }

        return this;
    },

    copeResult:function (result) {
        switch (result.status) {
            case '200':this.successCallback(result);break;
            case undefined:this.successCallback(result);break;
            default:this.errorCallback(result);break;
        }
    }
}
