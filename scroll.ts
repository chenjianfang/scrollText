///// <reference path="./declaration.d.ts" />
/*
    scrollData:string[]     消息容器
    targetEle:string        容器名字
    scrollName:string       滚动块外层容器类名  <ul>
    scrollItemName:string   滚动元素项的类名 <li>

*/

let scrollData:string[] = ["你好啊","第一条数据","第二条数据","第3条数据","第4条数据","第5条数据","第6条数据","第7条数据"];

//profix requestAnimationFrame
const setTimeTask = (function(){
  return  (<any>window).requestAnimationFrame       ||
          (<any>window).webkitRequestAnimationFrame ||
          (<any>window).mozRequestAnimationFrame    ||
          function( callback ){
            (<any>window).setTimeout(callback, 1000 / 60);
          };
})();
//profix cancelAnimationFrame
const clearTimeTask = (function(){
    return  (<any>window).cancelAnimationFrame      || 
            (<any>window).mozCancelAnimationFrame   ||
            (<any>window).clearTimeout;
})();

class ScrollBox{
    private scrollData:string[]
    targetEle: any
    scrollBox: any
    scrollName:string
    scrollItemName:string
    distance:number
    constructor(data:string[],targetEle:string){
        this.scrollData = data;
        this.targetEle = <HTMLElement>document.querySelector(targetEle);
        this.scrollName = ".scroll-box" 
        this.scrollItemName = ".scroll-item" 
        this.distance = -0.2;
        this.startRun();
    }
    //添加一条数据
    addPieceData(pieceData:string,index:number){
        this.scrollData.splice(index,0,pieceData);
        this.resetScroll();
    }
    //删除一条数据
    removePieceData(index:number){
        this.scrollData.splice(index,1);
        this.resetScroll();
    }
    targetEleHeight:number
    scrollBoxHeight:number
    //开始滚动数据
    private scrollST:number
    startRun(){
        const that = this;
        this.createELe();
        this.scrollBox = <HTMLElement>document.querySelector(this.scrollName);
        this.targetEleHeight = that.targetEle.offsetHeight;
        this.scrollBoxHeight = that.scrollBox.offsetHeight;

        //如果不大于容器高度不滚动
        if(this.scrollBoxHeight <= this.targetEleHeight) return;

        let endEleLock = false;


        this.setTimeRun();
    }
    //定时器滚动
    timeRun(){
        const top = +(window.getComputedStyle(this.scrollBox).getPropertyValue("top").replace(/px/,""));
        this.scrollBox.style.top = top+this.distance+"px";
        this.addListenerCopy(this.scrollBoxHeight,top,this.targetEleHeight);
    }
    setTimeRun(){
        this.scrollST = setTimeTask(function(){
            this.timeRun();
            this.setTimeRun();
        }.bind(this));
    }
    clearTimeRun(){
        clearTimeTask(this.scrollST);
    }
    //创建元素组件
    createELe(){
        const that = this;
        let str = `<ul class="${that.scrollName.replace(/.|#/,'')}">`;
        str += this.createContent();
        str += "</ul>";
        this.targetEle.innerHTML = str;
    }
    createContent(){
        let str = "";
        for(let i = 0, len = this.scrollData.length; i < len; i++){
            str += `<li class="${this.scrollItemName.replace(/.|#/,'')}">${this.scrollData[i]}</li>`;
        }
        return str;
    }
    //监听是否复制一份
    private endEleLock:boolean = false
    addListenerCopy(boxHeight,top,targetHeight){
        const that = this;
        if(boxHeight-Math.abs(top)<=targetHeight && !this.endEleLock){
            this.endEleLock = true;
            this.scrollBox.innerHTML += that.createContent();
        }
        if(Math.abs(top)>=boxHeight){
            this.resetScroll();
        }
    }
    //当复制份到达顶部删除重新开始
    resetScroll(){
        this.endEleLock = false;
        this.clearTimeRun();
        this.startRun();
    }
}


const scrollEntiry = new ScrollBox(scrollData,".scroll-ele");


const ele = <HTMLElement>document.querySelector(".scroll-ele");
const add = <HTMLElement>document.querySelector(".add");
const remove = <HTMLElement>document.querySelector(".remove");
//暂停
ele.addEventListener("mousemove",function(){
    scrollEntiry.clearTimeRun();
});
//开始
ele.addEventListener("mouseleave",function(){
    scrollEntiry.setTimeRun();
});
//首部增加一条
add.addEventListener("click",function(){
    scrollEntiry.addPieceData("新增的一条",0);
});
//尾部删除一条
remove.addEventListener("click",function(){
    scrollEntiry.removePieceData(0);
});