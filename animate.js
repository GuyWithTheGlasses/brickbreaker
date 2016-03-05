//Prep canvas for 2d drawing
var c = document.getElementById("brick");
var ctx = c.getContext("2d");

//Set fill & stroke color
ctx.fillStyle= "red";
ctx.strokeStyle = "#000000";

//Y-coordinate and dimensions of the paddle
var py = 520;
var pwidth = 50;
var pheight = 10;

//Draw initial paddle
ctx.fillRect(c.width/2, py, 50, 10);

//Moves paddle to mouse cursor's x value
var movePaddle = function(e){
    //Erase the previously drawn paddle
    ctx.clearRect(0, py, c.width, c.height);
    
    //Draw a new paddle where the cursor is
    ctx.fillRect(e.offsetX, py, pwidth, pheight);
};

//Tell entire canvas to listen for dragging
c.addEventListener("mousemove", movePaddle);


/*
var refresh = function(e){
    ctx.fillRect(e.offsetX, e.offsetY, 50, 10);
}

var start = document.getElementById("start");
start.addEventListener("click", function(){
    console.log("hello");
    requestId = window.requestAnimationFrame(refresh);
});
*/

