
/*------------------------------- Initialization ---------------------------------*/

//Prep canvas for 2d drawing
var c = document.getElementById("brick");
var ctx = c.getContext("2d");

//Start button
var start = document.getElementById("start");

//Y-coordinate and dimensions of the paddle
var py = 520;
var px = 0;
var pwidth = 50;
var pheight = 10;

//setting up for creation of blocks
var brickHeights = c.height/15;
var brickWidths = c.width/6;

//the coordinates of the ball & its radius
var ballx = c.width/3;
var bally = c.height/2;
var ballr = 5;

//x and y velocities
var xvel = 1;
var yvel = 1;

//requestAnimationFrame ID
var requestID;

//Draw paddle at initial location
ctx.fillRect(c.width/2, py, pwidth, pheight);

/*----------------------------- Moving the Paddle --------------------------------*/

//Moves paddle to mouse cursor's x value
var movePaddle = function(e){
    //Erase the previously drawn paddle
    ctx.clearRect(0, py, c.width, c.height);

    //Set fill & stroke color
    ctx.fillStyle= "red";
    ctx.strokeStyle = "#000000";
    px = e.offsetX;

    //Draw a new paddle where the cursor is
    ctx.fillRect(px, py, pwidth, pheight);
    //Reset the path
    ctx.beginPath();
};

//Tell entire canvas to listen for dragging
c.addEventListener("mousemove", movePaddle);

/*--------------------------- Brick & Ball Generation -----------------------------*/

//start game and generate blocks
start.addEventListener("click", function(){
    var x = 0;
    var y = 0;

    //forms each row
    while (y <= c.height/4) {

        //forms each column
        while (x <= c.width) {
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

    //Draw ball in initial position
    ctx.beginPath();
    ctx.arc(ballx, bally, ballr, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
});



/*------------------------------- Ball Movement ----------------------------------*/

//Moves the ball around the canvas
var moveBall = function(){
    //Erase the old ball
    ctx.clearRect(ballx - ballr, bally - ballr, ballr * 2, ballr * 2);
    //console.log("x = " + ballx);
    //console.log("y = " + bally + "\n");

    //Increment ballx and bally
    ballx += xvel;
    bally += yvel;

    //Check to see if collisions happened; if so, change velocities
    borderCheck();

    //Draw the ball in its new location
    ctx.fillStyle = "#000000";
    ctx.arc(ballx, bally, ballr, 0, 2 * Math.PI);
    ctx.fill();
    //Make sure to begin a new path to avoid trouble when filling
    ctx.beginPath();

    //Call this function again
    requestID = window.requestAnimationFrame(moveBall);
};

//Checks to see if the ball has hit the edge of the canvas
var borderCheck = function(){
    //If the x value hits an extreme, negate xvel
    if (ballx <= ballr || ballx >= c.width-ballr){
	     xvel *= -1;
    }
    //If the y value his an extreme, negate yvel
    if (bally <= ballr || bally >= c.height-ballr){
	     yvel *= -1;
    }



    //check if hitting the paddle
    if (bally + ballr >= py && ballx <= px + pwidth && ballx >= px) {
      console.log("hello");
      xvel *= -1;
      yvel *= -1;
    }
};


start.addEventListener("click",moveBall);
