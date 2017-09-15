///// <reference path="./declaration.d.ts" />
/*
    scrollData:string[]     消息容器
    targetEle:string        容器名字
    scrollName:string       滚动块外层容器类名  <ul>

*/
//profix requestAnimationFrame
var setTimeTask = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
//profix cancelAnimationFrame
var clearTimeTask = (function () {
    return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.clearTimeout;
})();
var ScrollBox = (function () {
    function ScrollBox(data, targetEle, scrollBox, direction) {
        if (direction === void 0) { direction = "vertical"; }
        //监听是否复制一份
        this.endEleLock = false;
        this.scrollData = data; //滚动数据
        this.targetEle = document.querySelector(targetEle); //容器
        this.scrollName = scrollBox.join(" "); //滚动元素容器
        this.distance = -0.2; //定时器滚动的距离
        this.direction = direction; //滚动的方向vertical||horizontal
        if (direction === "vertical") {
            this.startRun();
        }
        else {
            this.horizontalRun();
        }
    }
    //添加一条数据
    ScrollBox.prototype.addPieceData = function (pieceData, index) {
        this.scrollData.splice(index, 0, pieceData);
        this.resetScroll();
    };
    //删除一条数据
    ScrollBox.prototype.removePieceData = function (index) {
        this.scrollData.splice(index, 1);
        this.resetScroll();
    };
    ScrollBox.prototype.startRun = function () {
        var that = this;
        this.createELe();
        this.scrollBox = document.querySelector(this.scrollName.replace(/\s/g, ""));
        this.targetEleHeight = that.targetEle.offsetHeight;
        this.scrollBoxHeight = that.scrollBox.offsetHeight;
        //如果不大于容器高度不滚动
        if (this.scrollBoxHeight <= this.targetEleHeight)
            return;
        var endEleLock = false;
        this.setTimeRun();
    };
    //定时器滚动
    ScrollBox.prototype.timeRun = function () {
        var top = +(window.getComputedStyle(this.scrollBox).getPropertyValue("top").replace(/px/, ""));
        this.scrollBox.style.top = top + this.distance + "px";
        this.addListenerCopy(this.scrollBoxHeight, top, this.targetEleHeight);
    };
    ScrollBox.prototype.setTimeRun = function () {
        this.scrollST = setTimeTask(function () {
            this.timeRun();
            this.setTimeRun();
        }.bind(this));
    };
    ScrollBox.prototype.clearTimeRun = function () {
        clearTimeTask(this.scrollST);
    };
    //创建元素组件
    ScrollBox.prototype.createELe = function () {
        var that = this;
        var str = "<ul class=\"" + that.scrollName.replace(/\./g, '') + "\">";
        str += this.createContent();
        str += "</ul>";
        this.targetEle.innerHTML = str;
    };
    ScrollBox.prototype.createContent = function () {
        var str = "";
        for (var i = 0, len = this.scrollData.length; i < len; i++) {
            str += this.scrollData[i];
        }
        return str;
    };
    ScrollBox.prototype.addListenerCopy = function (boxHeight, top, targetHeight) {
        var that = this;
        if (boxHeight - Math.abs(top) <= targetHeight && !this.endEleLock) {
            this.endEleLock = true;
            this.scrollBox.innerHTML += that.createContent();
        }
        if (Math.abs(top) >= boxHeight) {
            this.resetScroll();
        }
    };
    //当复制份到达顶部删除重新开始
    ScrollBox.prototype.resetScroll = function () {
        this.endEleLock = false;
        this.clearTimeRun();
        this.startRun();
    };
    ScrollBox.prototype.horizontalRun = function () {
        var that = this;
        this.createELe();
        this.scrollBox = document.querySelector(this.scrollName.replace(/\s/g, ""));
        var childNode = this.scrollBox.children;
        this.widthCount = 0; //滚动元素宽度
        for (var i = 0, len = childNode.length; i < len; i++) {
            this.widthCount += Math.ceil(+window.getComputedStyle(childNode[i], null).getPropertyValue("width").replace(/px/, ""));
        }
        this.scrollBox.style.width = this.widthCount + "px";
        this.targetWidth = that.targetEle.offsetWidth; //容器宽度
        //如果不大于容器高度不滚动
        if (this.widthCount <= this.targetWidth)
            return;
        this.h_setTimeRun();
    };
    //垂直定时器滚动
    ScrollBox.prototype.h_timeRun = function () {
        var left = +(window.getComputedStyle(this.scrollBox).getPropertyValue("left").replace(/px/, ""));
        this.scrollBox.style.left = left + this.distance + "px";
        this.h_addListenerCopy(this.widthCount, left, this.targetWidth);
    };
    ScrollBox.prototype.h_setTimeRun = function () {
        this.scrollST = setTimeTask(function () {
            this.h_timeRun();
            this.h_setTimeRun();
            // widthCount:number
            // targetWidth:number
        }.bind(this));
    };
    //监听是否复制一份
    ScrollBox.prototype.h_addListenerCopy = function (widthCount, left, targetWidth) {
        var that = this;
        if (widthCount - Math.abs(left) <= targetWidth && !this.endEleLock) {
            this.endEleLock = true;
            this.scrollBox.innerHTML += that.createContent();
            this.scrollBox.style.width = 2 * this.widthCount + "px";
        }
        if (Math.abs(left) >= widthCount) {
            this.h_resetScroll();
        }
    };
    //当复制份到达顶部删除重新开始
    ScrollBox.prototype.h_resetScroll = function () {
        this.endEleLock = false;
        this.clearTimeRun();
        this.horizontalRun();
    };
    return ScrollBox;
}());
// const ele = <HTMLElement>document.querySelector(".scroll-ele");
// const add = <HTMLElement>document.querySelector(".add");
// const remove = <HTMLElement>document.querySelector(".remove");
// //暂停
// ele.addEventListener("mousemove",function(){
//     scrollEntiry.clearTimeRun();
// });
// //开始
// ele.addEventListener("mouseleave",function(){
//     scrollEntiry.setTimeRun();
// });
// //首部增加一条
// add.addEventListener("click",function(){
//     scrollEntiry.addPieceData("新增的一条",0);
// });
// //尾部删除一条
// remove.addEventListener("click",function(){
//     scrollEntiry.removePieceData(0);
// }); 
