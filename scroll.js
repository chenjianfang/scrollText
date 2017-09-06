///// <reference path="./declaration.d.ts" />
/*
    scrollData:string[]     消息容器
    targetEle:string        容器名字
    scrollName:string       滚动块外层容器类名  <ul>
    scrollItemName:string   滚动元素项的类名 <li>

*/
var scrollData = ["你好啊", "第一条数据", "第二条数据", "第3条数据", "第4条数据", "第5条数据", "第6条数据", "第7条数据"];
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
    function ScrollBox(data, targetEle) {
        //监听是否复制一份
        this.endEleLock = false;
        this.scrollData = data;
        this.targetEle = document.querySelector(targetEle);
        this.scrollName = ".scroll-box";
        this.scrollItemName = ".scroll-item";
        this.distance = -0.2;
        this.startRun();
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
        this.scrollBox = document.querySelector(this.scrollName);
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
        var str = "<ul class=\"" + that.scrollName.replace(/.|#/, '') + "\">";
        str += this.createContent();
        str += "</ul>";
        this.targetEle.innerHTML = str;
    };
    ScrollBox.prototype.createContent = function () {
        var str = "";
        for (var i = 0, len = this.scrollData.length; i < len; i++) {
            str += "<li class=\"" + this.scrollItemName.replace(/.|#/, '') + "\">" + this.scrollData[i] + "</li>";
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
    return ScrollBox;
}());
var scrollEntiry = new ScrollBox(scrollData, ".scroll-ele");
var ele = document.querySelector(".scroll-ele");
var add = document.querySelector(".add");
var remove = document.querySelector(".remove");
//暂停
ele.addEventListener("mousemove", function () {
    scrollEntiry.clearTimeRun();
});
//开始
ele.addEventListener("mouseleave", function () {
    scrollEntiry.setTimeRun();
});
//首部增加一条
add.addEventListener("click", function () {
    scrollEntiry.addPieceData("新增的一条", 0);
});
//尾部删除一条
remove.addEventListener("click", function () {
    scrollEntiry.removePieceData(0);
});
