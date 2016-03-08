
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
    //ctx.beginPath();
    ctx.arc(ballx, bally, ballr, 0, 2 * Math.PI);
    ctx.fill();
    //ctx.beginPath();
});

/*------------------------- Ball Movement & Unit Collision -----------------------------*/

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
    colorCheck();

    //Draw the ball in its new location
    ctx.fillStyle = "#000000";
    ctx.arc(ballx, bally, ballr, 0, 2 * Math.PI);
    ctx.fill();
    //Make sure to begin a new path to avoid trouble when filling
    ctx.beginPath();

    //Call this function again
    requestID = window.requestAnimationFrame(moveBall);
};

//Checks to see if the ball has collided:
//with the edge of the canvas - DONE
//with the paddle - DONE 
var collisionCheck = function(){
    //If the x value hits an extreme, negate xvel
    if (ballx <= ballr || ballx >= c.width-ballr){
	xvel *= -1;
    }
    //If the y value his an extreme, negate yvel
    if (bally <= ballr || bally >= c.height-ballr){
	yvel *= -1;
    }
    //Check if hitting the paddle from the top
    if (yvel > 0 && bally + ballr == py - 2 && ballx <= px + pwidth && ballx >= px){
	console.log("hello");
	yvel *= -1;
    }
};

//Checks to see if the color of the background changes
//aka see if the ball has collided with a brick
var colorCheck = function(){
    //Get the pixel colors from all around the ball
    var color = ctx.getImageData(ballx-ballr-1, bally-ballr-1,ballr*2+2,ballr*2+2);
    
    //Look through all the pixel colors
    for (var i=0 ; i<color.data.length ; i+=4){
	console.log(color.data[i]);
	//Check if any pixels are not white
	if (color.data[i]==255 && color.data[i+1]==255 && color.data[i+2]==255){
	    console.log("good stuff");
	}
	//If not, then we have a collision; we can stop searching
	else {
	    var pixelColor = [color.data[i], color.data[i+1], color.data[i+2]];
	    console.log(pixelColor);
	    eraseBrick(pixelColor);
	    break;
	}
    }
}

//THIS REALLY ISN'T WORKING GUYS LET'S JUST HARDCODE IT
//floodFills all pixels with same color as the collided one
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

start.addEventListener("click",moveBall);
