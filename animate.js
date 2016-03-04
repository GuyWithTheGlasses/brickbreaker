var c = document.getElementById("brick");
var start = document.getElementById("start");
var ctx = c.getContext("2d");
ctx.fillStyle= "red";
ctx.strokeStyle = "#000000";
ctx.fillRect(269, 520, 50, 10);
var x = 0;
var y = 0;

var refresh = function(e){
    x = e.offsetX;
    y = e.offsetY;
    ctx.fillRect(x, y, 50, 10);
}

start.addEventListener("click", function(){
    console.log("hello");
    requestId = window.requestAnimationFrame(refresh);
});

