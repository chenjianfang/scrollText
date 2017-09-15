


var aniEndName = (function(){
    var eleStyle = document.createElement('div').style;
    var verdors = ['a','webkitA','MozA','OA','msA'];
    var endEvents = ['animationend','webkitAnimationEnd','animationend','oAnimationEnd','MSAnimationEnd'];
    var animation;
    for(var i=0,len=verdors.length; i < len; i++){
        animation = verdors[i]+'nimation';
        if(animation in eleStyle){
            return endEvents[i];
        }
    }
    return 'animationend';
}());

var button = <HTMLElement>document.querySelector("button");
var rotate = <HTMLElement>document.querySelector(".circular");

setTimeout(function(){
    rotate.className += " base-rotate";
},500);

var lock = false;
// button.addEventListener("click",function(){
//     lock = false;
//     rotate.className += " base-rotate";
// });

// var index;
// rotate.addEventListener(aniEndName,function(){
//     if(lock) return;
//     lock = true;
//     index = ~~(Math.random()*8);
//     rotate.className = "circular rotate"+index;
// });



