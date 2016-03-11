
/*------------------------------- Initialization ---------------------------------*/

//Prep canvas for 2d drawing
var c = document.getElementById("brick");
var ctx = c.getContext("2d");

//Start button
var start = document.getElementById("start");

//Coordinates and dimensions of the paddle
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

//boolean for if lost game
var lost = false;

// the score box where score and loss status are added to
var scoreBox = document.getElementById("score-box");
var score = document.getElementById("score");
var whenLost = document.getElementById("lose-message");


//Draw paddle at initial location
ctx.fillStyle = "#FF0000";
ctx.fillRect(c.width/2, py, pwidth, pheight);

/*----------------------------- Moving the Paddle --------------------------------*/

//Moves paddle to mouse cursor's x value
var movePaddle = function(e){
    //Erase the previously drawn paddle
    ctx.clearRect(0, py, c.width, c.height);

    //Set fill & stroke color
    ctx.fillStyle= "#FF0000";
    ctx.strokeStyle = "#000000";

    //Record current x-coordinate
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
    ctx.arc(ballx, bally, ballr, 0, 2 * Math.PI);
    ctx.fill();
});

/*-------------------------------- Ball Movement  ----------------------------------*/

//Moves the ball around the canvas
var moveBall = function(){
    //Erase the old ball
    ctx.clearRect(ballx - ballr - 1, bally - ballr - 1, ballr*2 + 2, ballr*2 + 2);
    //There are -1's and +2's here because not all of the ball was getting erased
    //so this was just an easy fix
    //In collision we consider these -1's and +2's as part of the ball's hitbox

    //Increment ballx and bally
    ballx += xvel;
    bally += yvel;

    //Check to see if collisions happened; if so, change velocities
    collisionCheck();

    //Draw the ball in its new location
    ctx.fillStyle = "#000000";
    ctx.arc(ballx, bally, ballr, 0, 2 * Math.PI);
    ctx.fill();
    //Make sure to begin a new path to avoid trouble when filling
    ctx.beginPath();

    //Call this function again
    requestID = window.requestAnimationFrame(moveBall);


    // handles situation when player lost
    if (lost) {
      console.log("lost");
      console.log(lost);
      window.cancelAnimationFrame(requestID);
      score.innerHTML = "wooo";
      whenLost.innerHTML = "Sorry, you lost.";
    }
};

/*-------------------------------- Unit Collision -----------------------------------*/

//Checks to see if the ball has collided:
//with the edge of the canvas - DONE
//with the paddle - DONE
//with bricks - IN PROGRESS
//with the paddle - DONE
//with bricks - TOP/BOTTOM DONE
var collisionCheck = function(){
    //First check if the ball is hitting bottom (which means you lose)
    if (bally >= c.height-ballr) {
      lost = true;
    }

    //If the x value hits an extreme, negate xvel
    if (ballx <= ballr || ballx >= c.width-ballr){
	xvel *= -1;
    }
    //If the y value hits an extreme, negate yvel
    if (bally <= ballr){
      yvel *= -1;
    }
    //Check if hitting the paddle from the top
    if (yvel > 0 && bally + ballr == py - 2 && ballx <= px + pwidth && ballx >= px){
	console.log("hello");
	yvel *= -1;
    }

    //If we get through all of that, check brick collision

    //Get the pixel color from top left corner of ball's hitbox
    var color1 = ctx.getImageData(ballx-ballr-1, bally-ballr-1,1,1);
    //Top right corner
    var color2 = ctx.getImageData(ballx+ballr+1, bally-ballr-1,1,1);
    //Bottom left corner
    var color3 = ctx.getImageData(ballx-ballr-1, bally+ballr+1,1,1);
    //Bottom right corner
    var color4 = ctx.getImageData(ballx+ballr+1, bally+ballr+1,1,1);

    //Check if any of the 4 corners are now colored
    if(isBW(color1)){
	if(isBW(color2)){
	    if(isBW(color3)){
		if(isBW(color4)){
		}
	    }
	}
    }
}
//If any pixel is not black/white, erase that brick
var isBW = function(color){
    var whiteOrBlack = (color.data[0]==255 && color.data[1]==255 && color.data[2]==255) || (color.data[0]==0 && color.data[1]==0 && color.data[2]==0)
    if(!whiteOrBlack){
	eraseBrick2();
    }
    return whiteOrBlack;
};
//Erases the bricks at the preset x and y values
var eraseBrick2 = function() {
    for (var i=0; i<6; i++) {
	if ((ballx > i*brickWidths) && (ballx < (i+1)*brickWidths)) {
	    ctx.clearRect(i*brickWidths, bally-ballr-brickHeights-1, brickWidths, brickHeights+1);
	    //These 2 if statements currently don't work, so we can only interpret
	    //top/bottom collisions
	    //Check if ball is colliding from the side
	    if((ballx-ballr)%brickWidths == 0 || (ballx+ballr)%brickWidths == 0){
		xvel *= -1;
	    }
	    //Otherwise it's a top/bottom collision
	    else {
		yvel *= -1;
	    }
	    break;
	}
    }
}

start.addEventListener("click",moveBall);

//THIS REALLY ISN'T WORKING GUYS LET'S JUST HARDCODE IT
//floodFills all pixels with same color as the collided one
/*
var eraseBrick = function(c){
    //Array of pixels we must check
    //Starting from the detected pixel of different color
    var pixels = [];
    pixels.push([ballx-ballr-1, bally-ballr-1]);

    //For filling in one pixel at a time
    var id = ctx.createImageData(1,1);
    var d = id.data;

    while(pixels.length){
	//Get the first pixel from the array and its color
	var newPixel = pixels.pop();
	var newx = newPixel[0];
	var newy = newPixel[1];
	var newPixColor = ctx.getImageData(newx, newy, 1, 1);

	//If newPixel's color is the same as the first one, set it to white
	if(newPixColor.data[0] == c[0] &&
	   newPixColor.data[1] == c[1] &&
	   newPixColor.data[2] == c[2]){
	    //Set the image color to white
	    d[0] = 255; //red
	    d[1] = 255; //green
	    d[2] = 255; //blue
	    d[3] = 1; //alpa
	    //Add the 1x1 image
	    ctx.putImageData(id, newx, newy);

	    //Add to the array the 4 pixels adjacent to the newPixel
	    pixels.push([newx+1, newy]);
	    pixels.push([newx-1, newy]);
	    pixels.push([newx, newy+1]);
	    pixels.push([newx, newy-1]);
	}
	//If it's not white, don't do anything
    }
};
*/


start.addEventListener("click", moveBall);
