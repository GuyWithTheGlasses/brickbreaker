//Prep canvas for 2d drawing
var c = document.getElementById("brick");
var start = document.getElementById("start");
var ctx = c.getContext("2d");

//Set fill & stroke color
ctx.fillStyle= "red";
ctx.strokeStyle = "#000000";

//Y-coordinate and dimensions of the paddle
var py = 520;
var pwidth = 50;
var pheight = 10;

// setting up for creation of blocks
var brickHeights = c.height/15;
var brickWidths = c.width/6;

//the coordinates of the ball
var ballx = c.width/2;
var bally = c.height/2;

//the directional paths
var left = false;
var right = true;
var up = false;
var down = true;

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


//start game and generate blocks
start.addEventListener("click", function(){
    var x = 0;
    var y = 0;

    //forms each row
    while (y <= 538/4) {

        //forms each column
        while (x <= 538) {
          ctx.fillStyle = "rgb("+
              Math.floor(Math.random()*256)+","+
              Math.floor(Math.random()*256)+","+
              Math.floor(Math.random()*256)+")";

          //these if else statements are to have it alternate between longer or shorter blocks
          //doesn't work at the moment but would add some zest
          if (x % 2 == 0) {
              ctx.fillRect(x, y, brickWidths, brickHeights);
              x += brickWidths;
          }

          else {
              ctx.fillRect(x, y, brickWidths, brickHeights);
              x += brickWidths;
          }

        }
        x = 0;
        y += brickHeights;
    }

    //form the ball
    ctx.beginPath();
  	ctx.arc(c.width / 2, c.height / 2, 5, 0, 2 * Math.PI);
  	ctx.closePath();
  	ctx.fill();

    requestId = window.requestAnimationFrame(moveBall);

});



//TRIED TO MAKE THE CODE FOR THE BALL TO MOVE
//DIDNT WORK YET BUT LEFT IT HERE IN CASE YOU GUYS COULD WORK WITH THIS
// AN ISSUE WITH THIS IS ERASING AND REDRAWING THE CIRCLES, IF YOU USE clearRect THEN IT CLEARS EVERYTHING
// INCLUDING THE BLOCKS ABOVE, ITD BE GOOD TO FIND A FUNCTION THAT REMOVES 1 SHAPE
var moveBall = function(){
    ctx.arc(ballx, bally, 5, 0, 2 * Math.PI);

    if (ballx >= 700 - 150) {
      right = false;
      left = true;
    }

    else if (ballx <= 0) {
      left = false;
      right = true;
    }

    if (bally <= 0) {
      up = false;
      down = true;
    }

    else if (bally >= 700 - 100) {
      down = false;
      up = true;
    }

    if (right) {
      ballx = ballx + 2;
    }

    else if (left) {
      ballx = ballx - 2;
    }

    if (down) {
      bally = bally + 2;
    }

    else if (up) {
      bally = bally - 2;
    }
}
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
