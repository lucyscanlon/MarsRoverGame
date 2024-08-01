/*

The Game Project 7 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var mountains;
var clouds;

var starsArray = [];
var floorPatternArray = [];
var floorPatternColours = [];
var planets = [];
var flagpole;
var f;
var spikesArray = [];

var noGravityMode;
var g;

var game_score;
var lives;

var backgroundSound;
var gravityAlarmSound;
var plantCutSound;
var levelCompletedSound;
var fallenSound;
var cometExplosionSound;

var levelCompletedSoundCount;
var fallenSoundCount;
var explosionSoundCount;

function preload() {
    backgroundSound = loadSound('assets/backgroundmusic.mp3');
    gravityAlarmSound = loadSound('assets/gravityalarm.mp3');
    plantCutSound = loadSound('assets/plantcut.mp3');
    levelCompletedSound = loadSound('assets/levelcompleted.mp3');
    fallenSound = loadSound('assets/fallen2.mp3');
    cometExplosionSound = loadSound('assets/explosion2.mp3');
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    

    // Stars
    // (Stars and floor pattern have to go in set up otherwise the pattern repeats again after each life is lost and start game gets called again.)
    
    // Create 340 random stars
    for (var i = 0; i < 340; i++) {
        starsArray.push(new stars());
    }
    
    // Creates oval pattern on the floor 
    for (var i = 0; i < 40; i++) {
        floorPatternArray.push(new floorCircles());
    }
    
    // Floor pattern colours array
    floorPatternColours = [{
        r: 157,
        g: 34, 
        b: 31
    }, {
        r: 168,
        g: 43,
        b: 33
    }];
    
    // Start lives at 4
    lives = 4;
    
    // Call to start game at beginning
    startGame();
    
}

function draw()
{
	background(13, 14, 31); // fill the sky dark blue
    
    noStroke();
    fill(255);
    textFont("Courier New", 15);
    text("GAME SCORE: " + game_score, 30, 40);
    
	noStroke();
	fill(224,56,45);
	rect(0, floorPos_y, width, height/4); // draw some red ground
    
    // Gravity - if no gravity mode is off 
    
    if (noGravityMode == false) {
        
        if (floorPos_y > gameChar_y) {
            gameChar_y += 4;
            isFalling = true;
        } else {
            isFalling = false;
    
        }
        
    }
    
    
    push();
    
    translate(scrollPos, 0)
    
    // Draw stars
    
    drawStars();
    
    // Draw pattern on floor
    
    drawFloorPattern();
    
    // Draw the sun
    
    drawSun();
    
    // Draw planets 
    
    drawPlanets();
    
    // Draw Mountains/rocks
    
    drawMountains();

	// Draw clouds.
    
    drawClouds();
    
    // Draw Flag
    
    renderFlagpole();
    
    // Check Flat
    
    checkFlagpole();
    
    // draw Spikes

    for(var i = 0; i < spikesArray.length; i++) {
        drawSpikes(spikesArray[i]);
        checkSpikes(spikesArray[i]);
    }
    
	// Draw canyons.
    for(var h = 0; h < canyons.length; h++)
        {
          drawCanyon(canyons[h]); 
          checkCanyon(canyons[h]);
        }
    
    
	// Draw collectable items.
    
    for (var o = 0; o < collectable.length; o++) {
        if(!collectable[o].isFound) {
            drawCollectable(collectable[o]);
            checkCollectable(collectable[o]); 
        }
    }
    
    // Trigger comet 
    
    if (gameChar_world_x > 2657) {
        triggercommet();
    }
    
    // Check is game won to trigger sound
    
    gameWonTriggerSound();
    
    // Check if character is plummeting to play sound once
    
    fallenSoundPlay();
    
    pop();

	// Draw game character.
	
	drawGameChar();
    
    // Draw hearts for lives
    
    drawHearts();
    
    // If you run out of lives or you complete the level - display this text
    
    if (lives < 1) {
        
        fill(224,56,45,150);
        rect(344,86, 342, 30, 10);
        
        fill(255);
        noStroke();
        text("GAME OVER. PRESS SPACE TO CONTINUE", 362, 105);
        return;
    }
    
    if (flagpole.isReached == true) {
        fill(138,169,70,150);
        rect(315,86, 405, 30, 10);
        
        fill(255);
        noStroke();
        text("MISSION COMPLETE! PRESS SPACE TO CONTINUE", 333, 105);
        levelCompletedSoundCount++;
        return;
    }

	// Logic to make the game character move or the background scroll.
    
    if(isPlummeting == false) {
        if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    }
	

	// Logic to make the game character rise and fall.
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    text(mouseX + ',' + mouseY, mouseX, mouseY);
    
    
    // Check if character has fallen below the canvas
    
    if (gameChar_y > height + 100 && lives > 0) {
        startGame();
    }
    
    if (gameChar_y < 0 && lives > 0) {
        
        startGame();
        noGravityMode = false;
        
    }
}
    
// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    // Plays background music when any button is pressed
    backgroundSound.play();

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(keyCode == '65') {
        isLeft = true;
    } else if (keyCode == '68') {
        isRight = true;
    }
    
    if(keyCode == '87' && isFalling == false && isPlummeting == false) {
            gameChar_y = gameChar_y - 200;
    }
    
    if (keyCode == '32') {
        gameChar_y = floorPos_y;
    }
    
    // Turns gravity mode off when g is pressed
    if (noGravityMode == true && keyCode == '71') {
        console.log("gravity activated");
        
        noGravityMode = false;
        console.log(gameChar_y);
        
        gravityAlarmSound.stop();
        
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if (key == 'A') {
        isLeft = false;
    } else if (key == 'D') {
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    if(isLeft && isFalling) {
		fill(205,178,111);
        quad(gameChar_x - 11, gameChar_y - 20,
        gameChar_x - 6, gameChar_y - 20,
        gameChar_x - 1, gameChar_y - 5,
        gameChar_x - 8, gameChar_y - 5);
        quad(gameChar_x + 2, gameChar_y - 20,
        gameChar_x + 8, gameChar_y - 20,
        gameChar_x + 13, gameChar_y - 5,
        gameChar_x + 6, gameChar_y - 5);
    
        rect(gameChar_x - 15, gameChar_y - 53, 30,40,5);
        rect(gameChar_x - 2.5, gameChar_y - 60, 5,10);
        rect(gameChar_x - 9, gameChar_y - 70, 16, 12, 4, 2, 2, 4);
    
        fill(230,218,180);
        rect(gameChar_x - 9, gameChar_y - 70, 4, 12, 4, 0, 0, 4);
    
        fill(230,218,180);
        rect(gameChar_x - 12, gameChar_y - 51, 24,36,3);
        fill(205,178,111);
        rect(gameChar_x - 13, gameChar_y - 30, 15,17,3);
        rect(gameChar_x - 2, gameChar_y - 52, 15,17,3);
    
        fill(84);
        ellipse(gameChar_x - 5,gameChar_y - 3, 12,12);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 12,12);
    
        fill(130);
        ellipse(gameChar_x - 5,gameChar_y - 3, 10,10);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 10,10);
    
        fill(84);
        ellipse(gameChar_x - 5,gameChar_y - 3, 5,5);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 5,5);
    
        fill(170);
        ellipse(gameChar_x - 5,gameChar_y - 3, 4,4);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 4,4);
    
        fill(50);
        rect(gameChar_x - 9, gameChar_y - 68, 1, 8);
    
        fill(225,222,205);
        rect(gameChar_x - 9.7, gameChar_y - 68, 1, 8);
    
        fill(205,156,37);
        rect(gameChar_x - 10, gameChar_y - 67.2, 1, 6);
    
        fill(50);
        rect(gameChar_x - 10.4, gameChar_y - 67.2, 1, 6);

	} else if(isRight && isFalling) {
		fill(205,178,111);
        quad(gameChar_x - 7, gameChar_y - 20, 
         gameChar_x - 0, gameChar_y - 20, 
         gameChar_x - 7, gameChar_y - 5, 
         gameChar_x - 13, gameChar_y - 5);
        quad(gameChar_x + 7, gameChar_y - 20, 
         gameChar_x + 14, gameChar_y - 20, 
         gameChar_x + 7, gameChar_y - 5, 
         gameChar_x + 1, gameChar_y - 5);
        rect(gameChar_x - 15, gameChar_y - 53, 30,40,5);
        rect(gameChar_x - 2.5, gameChar_y - 60, 5,10);
        rect(gameChar_x - 7, gameChar_y - 70, 16, 12, 2, 4, 4, 2);
    
        fill(230,218,180);
        rect(gameChar_x + 5, gameChar_y - 70, 4, 12, 0, 4, 4, 0);
    
        fill(230,218,180);
        rect(gameChar_x - 12, gameChar_y - 51, 24,36,3);
        fill(205,178,111);
        rect(gameChar_x - 13, gameChar_y - 30, 15,17,3);
        rect(gameChar_x - 2, gameChar_y - 52, 15,17,3);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 12,12);
        ellipse(gameChar_x + 5,gameChar_y - 3, 12,12);
    
        fill(130);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 10,10);
        ellipse(gameChar_x + 5,gameChar_y - 3, 10,10);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 5,5);
        ellipse(gameChar_x + 5,gameChar_y - 3, 5,5);
    
        fill(170);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 4,4);
        ellipse(gameChar_x + 5,gameChar_y - 3, 4,4);
    
        fill(50);
        rect(gameChar_x + 8, gameChar_y - 68, 1, 8);
    
        fill(225,222,205);
        rect(gameChar_x + 8.7, gameChar_y - 68, 1, 8);
    
        fill(205,156,37);
        rect(gameChar_x + 9, gameChar_y - 67.2, 1, 6);
    
        fill(50);
        rect(gameChar_x + 9.4, gameChar_y - 67.2, 1, 6);

	} else if(isLeft) {
		fill(205,178,111);
        rect(gameChar_x - 12, gameChar_y - 20, 5, 15);
        rect(gameChar_x + 8, gameChar_y - 20, 5, 15);
        rect(gameChar_x - 15, gameChar_y - 53, 30,40,5);
        rect(gameChar_x - 2.5, gameChar_y - 60, 5,10);
        rect(gameChar_x - 9, gameChar_y - 70, 16, 12, 4, 2, 2, 4);
    
        fill(230,218,180);
        rect(gameChar_x - 9, gameChar_y - 70, 4, 12, 4, 0, 0, 4);
    
        fill(230,218,180);
        rect(gameChar_x - 12, gameChar_y - 51, 24,36,3);
        fill(205,178,111);
        rect(gameChar_x - 13, gameChar_y - 30, 15,17,3);
        rect(gameChar_x - 2, gameChar_y - 52, 15,17,3);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 12,12);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 12,12);
    
        fill(130);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 10,10);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 10,10);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 5,5);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 5,5);
    
        fill(170);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 4,4);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 4,4);
    
        fill(50);
        rect(gameChar_x - 9, gameChar_y - 68, 1, 8);
    
        fill(225,222,205);
        rect(gameChar_x - 9.7, gameChar_y - 68, 1, 8);
    
        fill(205,156,37);
        rect(gameChar_x - 10, gameChar_y - 67.2, 1, 6);
        
        fill(50);
        rect(gameChar_x - 10.4, gameChar_y - 67.2, 1, 6);

	} else if(isRight) {
		fill(205,178,111);
        rect(gameChar_x - 12, gameChar_y - 20, 5, 15);
        rect(gameChar_x + 8, gameChar_y - 20, 5, 15);
        rect(gameChar_x - 15, gameChar_y - 53, 30,40,5);
        rect(gameChar_x - 2.5, gameChar_y - 60, 5,10);
        rect(gameChar_x - 7, gameChar_y - 70, 16, 12, 2, 4, 4, 2);
    
        fill(230,218,180);
        rect(gameChar_x + 5, gameChar_y - 70, 4, 12, 0, 4, 4, 0);
    
        fill(230,218,180);
        rect(gameChar_x - 12, gameChar_y - 51, 24,36,3);
        fill(205,178,111);
        rect(gameChar_x - 13, gameChar_y - 30, 15,17,3);
        rect(gameChar_x - 2, gameChar_y - 52, 15,17,3);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 12,12);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 12,12);
    
        fill(130);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 10,10);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 10,10);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 5,5);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 5,5);
    
        fill(170);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 4,4);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 4,4);
    
        fill(50);
        rect(gameChar_x + 8, gameChar_y - 68, 1, 8);
    
        fill(225,222,205);
        rect(gameChar_x + 8.7, gameChar_y - 68, 1, 8);
    
        fill(205,156,37);
        rect(gameChar_x + 9, gameChar_y - 67.2, 1, 6);
    
        fill(50);
        rect(gameChar_x + 9.4, gameChar_y - 67.2, 1, 6);

	} else if(isFalling || isPlummeting) {
		fill(205,178,111);
        quad(gameChar_x - 12, gameChar_y - 20, 
         gameChar_x - 5, gameChar_y - 20, 
         gameChar_x - 12, gameChar_y - 5, 
         gameChar_x - 18, gameChar_y - 5);
        quad(gameChar_x + 8, gameChar_y - 20,
        gameChar_x + 14, gameChar_y - 20,
        gameChar_x + 19, gameChar_y - 5,
        gameChar_x + 12, gameChar_y - 5);
        rect(gameChar_x - 22.5, gameChar_y - 53, 45,40,5);
        rect(gameChar_x - 2.5, gameChar_y - 60, 5,10);
        rect(gameChar_x - 14, gameChar_y - 70, 28, 12, 6);
        fill(230,218,180);
        rect(gameChar_x - 20, gameChar_y - 51, 40,36,3);
        fill(205,178,111);
        rect(gameChar_x - 22, gameChar_y - 53, 23,23,5);
        rect(gameChar_x + 5, gameChar_y - 28, 16,14,3);
    
        fill(84);
        ellipse(gameChar_x - 14,gameChar_y - 3, 12,12);
        ellipse(gameChar_x + 16,gameChar_y - 3, 12,12);
    
        fill(130);
        ellipse(gameChar_x - 14,gameChar_y - 3, 10,10);
        ellipse(gameChar_x + 16,gameChar_y - 3, 10,10);
    
        fill(84);
        ellipse(gameChar_x - 14,gameChar_y - 3, 5,5);
        ellipse(gameChar_x + 16,gameChar_y - 3, 5,5);
    
        fill(170);
        ellipse(gameChar_x - 14,gameChar_y - 3, 4,4);
        ellipse(gameChar_x + 16,gameChar_y - 3, 4,4);

        fill(230,218,180);
        rect(gameChar_x - 12, gameChar_y - 68.5, 10, 9, 4, 0, 0, 4 );
        triangle(gameChar_x - 2, gameChar_y - 68.5, gameChar_x - 4, gameChar_y - 59.5, gameChar_x + 5, gameChar_y - 59.5);
    
        fill(50);
        ellipse(gameChar_x - 5, gameChar_y - 64, 8,8);
        ellipse(gameChar_x + 5, gameChar_y - 64, 8,8);
    
        fill(225,222,205);
        ellipse(gameChar_x - 5, gameChar_y - 64, 7,7);
        ellipse(gameChar_x + 5, gameChar_y - 64, 7,7);
    
        fill(205,156,37);
        ellipse(gameChar_x - 5, gameChar_y - 64, 6,6);
        ellipse(gameChar_x + 5, gameChar_y - 64, 6,6);
    
        fill(50);
        ellipse(gameChar_x - 5, gameChar_y - 64, 5,5);
        ellipse(gameChar_x + 5, gameChar_y - 64, 5,5);

	} else {
		fill(205,178,111);
        rect(gameChar_x - 12, gameChar_y - 20, 5, 15);
        rect(gameChar_x + 8, gameChar_y - 20, 5, 15);
        rect(gameChar_x - 22.5, gameChar_y - 53, 45,40,5);
        rect(gameChar_x - 2.5, gameChar_y - 60, 5,10);
        rect(gameChar_x - 14, gameChar_y - 70, 28, 12, 6);
        fill(230,218,180);
        rect(gameChar_x - 20, gameChar_y - 51, 40,36,3);
        fill(205,178,111);
        rect(gameChar_x - 22, gameChar_y - 53, 23,23,5);
        rect(gameChar_x + 5, gameChar_y - 28, 16,14,3);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 12,12);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 12,12);
    
        fill(130);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 10,10);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 10,10);
    
        fill(84);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 5,5);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 5,5);
    
        fill(170);
        ellipse(gameChar_x - 9.5,gameChar_y - 3, 4,4);
        ellipse(gameChar_x + 10.5,gameChar_y - 3, 4,4);

        fill(230,218,180);
        rect(gameChar_x - 12, gameChar_y - 68.5, 10, 9, 4, 0, 0, 4 );
        triangle(gameChar_x - 2, gameChar_y - 68.5, gameChar_x - 4, gameChar_y - 59.5, gameChar_x + 5, gameChar_y - 59.5);
    
        fill(50);
        ellipse(gameChar_x - 5, gameChar_y - 64, 8,8);
        ellipse(gameChar_x + 5, gameChar_y - 64, 8,8);
        
        fill(225,222,205);
        ellipse(gameChar_x - 5, gameChar_y - 64, 7,7);
        ellipse(gameChar_x + 5, gameChar_y - 64, 7,7);
    
        fill(205,156,37);
        ellipse(gameChar_x - 5, gameChar_y - 64, 6,6);
        ellipse(gameChar_x + 5, gameChar_y - 64, 6,6);
    
        fill(50);
        ellipse(gameChar_x - 5, gameChar_y - 64, 5,5);
        ellipse(gameChar_x + 5, gameChar_y - 64, 5,5);

    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
        
    for (var c = 0; c < clouds.length; c++) {
        
        //cloud
        //highlight
    
        fill(57, 58, 80);
        ellipse((clouds[c].x_pos - 23) * clouds[c].scale, (clouds[c].y_pos + 10) * clouds[c].scale, 85 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 25) * clouds[c].scale, (clouds[c].y_pos + 20) * clouds[c].scale, 50 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 56) * clouds[c].scale, (clouds[c].y_pos + 23) * clouds[c].scale,50 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 82) * clouds[c].scale,(clouds[c].y_pos + 32) * clouds[c].scale,40 * clouds[c].scale);
    
        //main cloud
    
        fill(23, 24, 43);
	   rect((clouds[c].x_pos - 100) * clouds[c].scale,(clouds[c].y_pos + 25) * clouds[c].scale,200 * clouds[c].scale,50 * clouds[c].scale);
        ellipse((clouds[c].x_pos - 30) * clouds[c].scale,(clouds[c].y_pos + 11) * clouds[c].scale,85 * clouds[c].scale);
        ellipse((clouds[c].x_pos - 100) * clouds[c].scale,(clouds[c].y_pos + 50) * clouds[c].scale,50 * clouds[c].scale);
        ellipse((clouds[c].x_pos - 93) * clouds[c].scale,(clouds[c].y_pos + 27) * clouds[c].scale,50 * clouds[c].scale);
        ellipse((clouds[c].x_pos - 75) * clouds[c].scale,(clouds[c].y_pos + 5) * clouds[c].scale,30 * clouds[c].scale);
        ellipse((clouds[c].x_pos - 75) * clouds[c].scale,(clouds[c].y_pos + 5) * clouds[c].scale,30 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 25) * clouds[c].scale,(clouds[c].y_pos + 20) * clouds[c].scale,40 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 56) * clouds[c].scale,(clouds[c].y_pos + 23) * clouds[c].scale,40 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 85) * clouds[c].scale,(clouds[c].y_pos + 32) * clouds[c].scale,30 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 98) * clouds[c].scale,(clouds[c].y_pos + 40) * clouds[c].scale,30 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 105) * clouds[c].scale,(clouds[c].y_pos + 55) * clouds[c].scale,30 * clouds[c].scale);
        ellipse((clouds[c].x_pos + 100) * clouds[c].scale,(clouds[c].y_pos + 62.5) * clouds[c].scale,25 * clouds[c].scale);
        
        // Make clouds move to the right
        clouds[c].x_pos = clouds[c].x_pos + 0.2;
        
    }
        
}

// Function to draw mountains objects.
function drawMountains() {
        
    for (var m = 0; m < mountains.length; m++) {

        fill(133,34,26);
        triangle(mountains[m].x_pos,mountains[m].y_pos,mountains[m].x_pos  + (mountains[m].width * 0.5),mountains[m].y_pos - mountains[m].height, mountains[m].x_pos + mountains[m].width, mountains[m].y_pos);
        fill(149,38,29);
        triangle(mountains[m].x_pos + (mountains[m].width*0.60),mountains[m].y_pos,mountains[m].x_pos  + (mountains[m].width * 0.5), mountains[m].y_pos - mountains[m].height,mountains[m].x_pos + mountains[m].width,mountains[m].y_pos);
        fill(168,43,33);
        triangle(mountains[m].x_pos + (mountains[m].width*0.85), mountains[m].y_pos,mountains[m].x_pos  + (mountains[m].width * 0.5),mountains[m].y_pos - mountains[m].height,mountains[m].x_pos + mountains[m].width,mountains[m].y_pos);
        
    }
        
}

// Function to draw trees objects.
function drawTrees() {
        
    for (var i = 0; i < trees_x.length; i++) {
        
        // tree 
    
        fill(147,119,91);
        quad(trees_x[i] - 11, treePos_y - 165,trees_x[i] + 2,treePos_y - 135,trees_x[i] + 2, treePos_y - 111,trees_x[i] - 21, treePos_y - 161);
        quad(trees_x[i] + 41, treePos_y - 162,trees_x[i] + 54,treePos_y - 161,trees_x[i] + 17, treePos_y - 92,trees_x[i] + 17, treePos_y - 112);
    
    
        fill(121,98,74);
        quad(trees_x[i] - 11, treePos_y - 165,trees_x[i] + 2,treePos_y - 135,trees_x[i] + 2, treePos_y - 123,trees_x[i] - 15, treePos_y - 163);
        quad(trees_x[i] + 46, treePos_y - 160,trees_x[i] + 54,treePos_y - 161,trees_x[i] + 17, treePos_y - 92,trees_x[i] + 17, treePos_y - 102);
    
        //trunk
        fill(147,119,91);
        rect(trees_x[i], treePos_y - 160,20,160);
        fill(121,98,74);
        rect(trees_x[i] + 10,treePos_y - 160,10,160);

    
        fill(151,203,122);
        triangle(trees_x[i] + 10,treePos_y - 345,trees_x[i] - 60,treePos_y - 160, trees_x[i] + 80, treePos_y - 160);
    
        fill(136,182,110);
        triangle(trees_x[i] + 10,treePos_y - 345,trees_x[i] + 10,treePos_y - 160, trees_x[i] + 80, treePos_y - 160);
        
    }
        
}



// Function to draw stars in the background

function drawStars() {
    for(var i = 0; i < starsArray.length; i++) {
        fill(255,255,255);
        noStroke();
        ellipse(starsArray[i].x_pos, starsArray[i].y_pos, starsArray[i].size);
    }
}

function stars() {
    this.x_pos = random(-1000, 4200);
    this.y_pos = random(0, 420);
    this.size = random(0, 6);
}



// Functions to draw the floor pattern 

function drawFloorPattern() {
    for (var i = 0; i < floorPatternArray.length; i++) {
        
        if (i % 2) {
            fill(floorPatternColours[0].r, floorPatternColours[0].g, floorPatternColours[0].b);
        } else {
            fill(floorPatternColours[1].r, floorPatternColours[1].g, floorPatternColours[1].b, 100);
        }
        
        ellipse(floorPatternArray[i].x_pos, floorPatternArray[i].y_pos,floorPatternArray[i].size,(floorPatternArray[i].size / 2));
        
    }
}


function floorCircles() {
    this.x_pos = random(-1000, 4300);
    this.y_pos = random(455, 560);
    this.size = random(10, 100);
}


// Function to draw planets 

function drawPlanets() {
    for(var i = 0; i < planets.length; i++) {
        
        fill(planets[i].r, planets[i].g, planets[i].b, 5);
        ellipse(planets[i].x_pos, planets[i].y_pos, (planets[i].size * 2))
        
        fill(planets[i].r, planets[i].g, planets[i].b, 20);
        ellipse(planets[i].x_pos, planets[i].y_pos, (planets[i].size * 1.35))
        
        fill(planets[i].r, planets[i].g, planets[i].b);
        ellipse(planets[i].x_pos, planets[i].y_pos, planets[i].size)
        
        fill(planets[i].s_r, planets[i].s_g, planets[i].s_b);
        for(var s = 0; s < 3; s++) {
            ellipse((planets[i].x_pos - (planets[i].size * 0.05)), (planets[i].y_pos + (planets[i].size * 0.2)), (planets[i].size * 0.11))
            
            ellipse((planets[i].x_pos - (planets[i].size * 0.25)), (planets[i].y_pos + (planets[i].size * 0.2)), (planets[i].size * 0.18))
            
            ellipse((planets[i].x_pos - (planets[i].size * 0.1)), (planets[i].y_pos + (planets[i].size * 0.35)), (planets[i].size * 0.13))
        }
        
        fill(255,255,255,50);
        ellipse((planets[i].x_pos + (planets[i].size * 0.10) ), (planets[i].y_pos - (planets[i].size * 0.07)) , (planets[i].size - (planets[i].size * 0.20)))
        
        fill(255,255,255,50);
        ellipse((planets[i].x_pos + (planets[i].size * 0.22) ), (planets[i].y_pos - (planets[i].size * 0.14)) , (planets[i].size - (planets[i].size * 0.50)))
    }
}



// function to draw the sun

function drawSun() {
    
    fill(247, 147, 29, 3);
    ellipse(1500,132, 700);
    
    fill(247, 147, 29, 8);
    ellipse(1500,132, 550);
    
    fill(247, 147, 29, 10);
    ellipse(1500,132, 300);
    
    fill(247, 147, 29, 12);
    ellipse(1500,132, 200);
    
    fill(247, 147, 29);
    ellipse(1500,132, 110);
    
    fill(241, 90, 36);
    ellipse(1500,132, 70);

}


function renderFlagpole() {
    
    fill(130);
    rect((flagpole.x_pos - 10), 427, 20, 5);
    
    fill(96);
    rect((flagpole.x_pos - 2), 294, 4, 133);
    
    fill(130);
    rect((flagpole.x_pos - 5), (380 - f), 10, 5);
    rect((flagpole.x_pos - 5), (400 - f), 10, 5);
    
    fill(17, 41, 97);
    rect((flagpole.x_pos + 5), (372.5 - f), 60, 40);
    
    fill(255);
    rect((flagpole.x_pos + 28.25), (372.5 - f), 13, 40);
    rect((flagpole.x_pos + 5), (385.75 - f), 60, 13.5);
    
    fill(173,27,51);
    rect((flagpole.x_pos + 31), (372.5 - f), 8, 40);
    rect((flagpole.x_pos + 5), (388.5 - f), 60, 8);
    
    if (flagpole.isReached == true && (f < 75)) {
        f = f + 2;
    } 
    
}


// Function to draw hearts / lives

function drawHearts() {
    
    var hearts = {
        x_pos: ((width/2) - 50),
        y_pos: 40
    }
    
    var h = 0;
    
    var l = (width/2 - 60);
    
    for (var i = 0; i < lives; i++) {
        fill(203, 51, 40);
        ellipse((hearts.x_pos + h), hearts.y_pos, 15, 17);
        ellipse(((hearts.x_pos + 15) + h), hearts.y_pos, 15, 17);
        beginShape();
        vertex(((hearts.x_pos - 7) + h), (hearts.y_pos + 1));
        vertex(((hearts.x_pos - 4.5) + h), (hearts.y_pos + 7));
        vertex(((hearts.x_pos - 1) + h), (hearts.y_pos + 11));
        vertex(((hearts.x_pos + 8) + h), (hearts.y_pos + 21));
        vertex(((hearts.x_pos + 20.5) + h), (hearts.y_pos + 6));
        vertex(((hearts.x_pos + 22) + h), (hearts.y_pos + 1));
        endShape();
        
        h = h + 40;
    }
    
    
}



// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(13, 14, 31);
    quad((t_canyon.x_pos - (t_canyon.width * 0.5)), (height * 3/4), (t_canyon.x_pos + (t_canyon.width * 0.5)), (height * 3/4), (t_canyon.x_pos + (t_canyon.width * 0.5)), height, (t_canyon.x_pos - (t_canyon.width * 0.5)), height);
    
    fill(86,22,17);
    triangle((t_canyon.x_pos - (t_canyon.width * 0.5)), (height * 3/4), (t_canyon.x_pos - (t_canyon.width * 0.5) - 10), 470, (t_canyon.x_pos - (t_canyon.width * 0.5)), 519);
    triangle((t_canyon.x_pos - (t_canyon.width * 0.5)), 519, (t_canyon.x_pos - (t_canyon.width * 0.5) - 10), 556, (t_canyon.x_pos - (t_canyon.width * 0.5)), 590);
    triangle((t_canyon.x_pos + (t_canyon.width * 0.5)), (height * 3/4), (t_canyon.x_pos + (t_canyon.width * 0.5) + 10), 470, (t_canyon.x_pos + (t_canyon.width * 0.5)), 519);
    triangle((t_canyon.x_pos + (t_canyon.width * 0.5)), 519, (t_canyon.x_pos + (t_canyon.width * 0.5) + 10), 556, (t_canyon.x_pos + (t_canyon.width * 0.5)), 590);
    
    
    // Canyon Stars
    fill(255);
    ellipse((t_canyon.x_pos - (t_canyon.width * 0.3)), ((height * 3/4) + 50), 3);
    ellipse((t_canyon.x_pos + (t_canyon.width * 0.3)), ((height * 3/4) + 10), 1);
    ellipse((t_canyon.x_pos - (t_canyon.width * 0.37)), ((height * 3/4) + 100), 6);
    ellipse((t_canyon.x_pos), ((height * 3/4) + 70), 4);
    ellipse((t_canyon.x_pos + (t_canyon.width * 0.35)), ((height * 3/4) + 50), 3);
    ellipse((t_canyon.x_pos + (t_canyon.width * 0.4)), ((height * 3/4) + 100), 2);

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if((gameChar_world_x > (t_canyon.x_pos - (t_canyon.width / 2)) && gameChar_world_x < t_canyon.x_pos + (t_canyon.width / 2))) {
        
        if((gameChar_y < (floorPos_y + 5)) && (gameChar_y > (floorPos_y - 5))) {
            console.log("fall");
            isPlummeting = true;
        }
        
        if (isPlummeting == true) {
        gameChar_y += 20;
            fallenSoundCount++;
        }
    }
}

// Function to play the fallen sound once
function fallenSoundPlay() {
    if (fallenSoundCount == 1) {
        fallenSound.play();
        console.log(fallenSoundCount);
    }
    
    // When counter reaches 30 it resets to 0 so the sound can be played again without it being repeated each time the draw loop is called
    if (fallenSoundCount == 30) {
        fallenSoundCount = 0;
    }
}


// Function to trigger comet 

function triggercommet() {
    
    fill(253,86,32);
    ellipse(comet.x_pos, comet.y_pos, 90);
    beginShape();
    vertex((comet.x_pos - 45), comet.y_pos);
    vertex((comet.x_pos - 43), (comet.y_pos - 79));
    vertex((comet.x_pos - 24), (comet.y_pos - 62));
    vertex((comet.x_pos - 11), (comet.y_pos - 137));
    vertex((comet.x_pos + 14), (comet.y_pos - 58));
    vertex((comet.x_pos + 34), (comet.y_pos - 82));
    vertex((comet.x_pos + 45), (comet.y_pos - 2));
    endShape();
    fill(255,151,0);
    ellipse(comet.x_pos, comet.y_pos, 60);
    fill(255,248,194);
    ellipse(comet.x_pos, comet.y_pos, 30);

    if (explosionSoundCount < 40) {
        explosionSoundCount += 1;
    }
    
    comet.x_pos += 0.1;
    comet.y_pos += 10;
    
    if (comet.y_pos == 410) {
        addCanyon();   
    } 
    
    if (explosionSoundCount == 37) {
        cometExplosionSound.play();
    }
}

// Adds a canyon to the canyon array after comet hits
function addCanyon(){
    splice(canyons, {
        x_pos: (comet.x_pos + 10),
        y_pos: (height * 3/4),
        width: 100
    }, 3);
}
 

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(138, 169, 70);
    quad(t_collectable.x_pos,(t_collectable.y_pos - 43), (t_collectable.x_pos + 1), (t_collectable.y_pos - 43), (t_collectable.x_pos + 2), t_collectable.y_pos, ((t_collectable.x_pos - 1)), t_collectable.y_pos);
    quad((t_collectable.x_pos + 1), (t_collectable.y_pos - 19), (t_collectable.x_pos + 7), (t_collectable.y_pos - 35), (t_collectable.x_pos + 18), (t_collectable.y_pos - 38), (t_collectable.x_pos + 13), (t_collectable.y_pos - 28))
    quad(t_collectable.x_pos, 406, (t_collectable.x_pos - 11), (t_collectable.y_pos - 32), (t_collectable.x_pos - 16), (t_collectable.y_pos - 41), (t_collectable.x_pos - 4), (t_collectable.y_pos - 36));
    
    fill(116, 143, 59);
    quad((t_collectable.x_pos + 1), (t_collectable.y_pos - 19), (t_collectable.x_pos + 10), (t_collectable.y_pos - 31), (t_collectable.x_pos + 18), (t_collectable.y_pos - 38), (t_collectable.x_pos + 14), (t_collectable.y_pos - 27));
    quad((t_collectable.x_pos), (t_collectable.y_pos - 27), (t_collectable.x_pos - 12), (t_collectable.y_pos - 31), (t_collectable.x_pos - 16), (t_collectable.y_pos - 41), (t_collectable.x_pos - 7), (t_collectable.y_pos - 35));

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    collectableDistance = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
    
    if(collectableDistance < 40 ) {
        t_collectable.isFound = true;
        game_score = game_score + 1;
        plantCutSound.play();
    }
}


// Check if character is in distance of the flag 

function checkFlagpole() {
    flagDistance = dist(gameChar_world_x, gameChar_y, flagpole.x_pos, 433);
    
    if (flagDistance < 40) {
        flagpole.isReached = true;
        
    }

}


function gameWonTriggerSound() {
    if (levelCompletedSoundCount == 1) {
        levelCompletedSound.play();
    } else {
        return;
    }
}

// Draw spikes function
function drawSpikes(t_spikes) {
    fill(58,12,11);
    rect(t_spikes.x_pos, (t_spikes.y_pos - 6), 100, 5);
    
    fill(88,19,17);
    
    var s = 0;
    
    // Draw ten spikes
    for (var i = 0; i < 10; i++) {
        triangle((t_spikes.x_pos + s), (t_spikes.y_pos - 6), ((t_spikes.x_pos + 5) + s), (t_spikes.y_pos - 18), ((t_spikes.x_pos + 10 ) + s), (t_spikes.y_pos - 6));
        s = s + 10;
    } 
}

// Check Spikes function 

function checkSpikes(t_spikes) {
    
    // If character runs over spikes
    if(gameChar_world_x > (t_spikes.x_pos) && gameChar_world_x < t_spikes.x_pos + 100 && (gameChar_y > (t_spikes.y_pos - 10)) && gameChar_y < (t_spikes.y_pos + 10)) {
        
        noGravityMode = true; 
        gravityAlarmSound.play();
    }
    
    if (noGravityMode == true) {
        noGravity();
    }
    
}

// Check platform function 

function checkSpikes(t_spikes) {
    
    // If character runs over spikes
    if(gameChar_world_x > (t_spikes.x_pos) && gameChar_world_x < t_spikes.x_pos + 100 && (gameChar_y > (t_spikes.y_pos - 10)) && gameChar_y < (t_spikes.y_pos + 10)) {
        
        noGravityMode = true; 
        gravityAlarmSound.play();
    }
    
    if (noGravityMode == true) {
        noGravity();
    }
    
}


// Function for no gravity mode after stepping on spikes

function noGravity() {
    gameChar_y = gameChar_y - 0.5;
        
    console.log(gameChar_y);
    
    rect(((gameChar_world_x - gameChar_x) + 249), 77, 545, 60, 10);

    fill(255);
    text("OH NO! THE SPIKES HAVE BROKEN YOUR GRAVITY DEVICE.", ((gameChar_world_x - gameChar_x) + 300), 100);
    text("PRESS THE 'G' KEY TO INITIATE AN EMERGENCY GRAVITY PACK", ((gameChar_world_x - gameChar_x) + 272), 120);
    text("(HINT: YOU CAN STILL MOVE LEFT AND RIGHT)", ((gameChar_world_x - gameChar_x) + 330), 180);
}

// Start Game 

function startGame() {
    
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    // Set game score 
    
    game_score = 0;
    
    // Set counts 
    levelCompletedSoundCount = 0;
    fallenSoundCount = 0;
    explosionSoundCount = 0;
    
    // Set gravity mode off
    noGravityMode = false;
    g = 0;
    
    gravityAlarmSound.stop();
    
    // When flag is reached this will increase, moving the flag up.
    f = 0;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    
    // Draw Planets 
    
    planets = [{
        r: 133,
        g: 182,
        b: 230,
        x_pos: 200,
        y_pos: 200,
        size: 60,
        s_r: 79,
        s_g: 155,
        s_b: 230
    }, {
        r: 231,
        g: 186,
        b: 141,
        x_pos: 900,
        y_pos: 173,
        size: 80,
        s_r: 231,
        s_g: 167,
        s_b: 103
    }, {
        r: 165,
        g: 132,
        b: 184,
        x_pos: 2360,
        y_pos: 175,
        size: 75,
        s_r: 157,
        s_g: 109,
        s_b: 184 
    }, {
        r: 136, 
        g: 184,
        b: 114,
        x_pos: 2700,
        y_pos: 300,
        size: 50,
        s_r: 111,
        s_g: 184,
        s_b: 79
    }, {
        r: 138,
        g: 169,
        b: 70,
        x_pos: 500,
        y_pos: 325,
        size: 45,
        s_r: 106,
        s_g: 155,
        s_b: 0
    }, {
        r: 135,
        g: 217,
        b: 207,
        x_pos: -200,
        y_pos: 100,
        size: 68,
        s_r: 76,
        s_g: 217,
        s_b: 200
    }, {
        r: 80,
        g: 85,
        b: 169,
        x_pos: -700,
        y_pos: 275,
        size: 90,
        s_r: 58,
        s_g: 64,
        s_b: 169
    }, {
        r: 80,
        g: 85,
        b: 169,
        x_pos: 3232,
        y_pos: 165,
        size: 90,
        s_r: 58,
        s_g: 64,
        s_b: 169
    }, {
        r: 221, 
        g: 137,
        b: 97,
        x_pos: 2850,
        y_pos: 102,
        size: 50,
        s_r: 189,
        s_g: 117,
        s_b: 82
    }, {
        r: 189, 
        g: 32,
        b: 32,
        x_pos: 3850,
        y_pos: 102,
        size: 70,
        s_r: 149,
        s_g: 32,
        s_b: 32
    }]
    

    //clouds 
    
    clouds = [{
        x_pos: 765,
        y_pos: 300,
        scale: 0.6
    }, {
        x_pos: 865,
        y_pos: 330,
        scale: 0.6
    }, {
        x_pos: 1805,
        y_pos: 280,
        scale: 0.6
    }, {
        x_pos: 3205,
        y_pos: 270,
        scale: 0.6
    }, {
        x_pos: 3355,
        y_pos: 300,
        scale: 0.6
    }, {
        x_pos: 4905,
        y_pos: 290,
        scale: 0.6
    }, {
        x_pos: 4705,
        y_pos: 280,
        scale: 0.6
    }, {
        x_pos: -200,
        y_pos: 280,
        scale: 0.6
    }, {
        x_pos: -900,
        y_pos: 120,
        scale: 0.6
    }];
    
    
    // Mountains
    mountains = [{
        x_pos: -300,
        y_pos: height * 3/4,
        height: 190,
        width: 289
    }, {
        x_pos: -320,
        y_pos: height * 3/4,
        height: 80,
        width: 100
    }, {
        x_pos: 250,
        y_pos: height * 3/4,
        height: 152,
        width: 299
    }, {
        x_pos: 200,
        y_pos: height * 3/4,
        height: 150,
        width: 280
    }, {
        x_pos: 600,
        y_pos: height * 3/4,
        height: 100,
        width: 160
    }, {
        x_pos: 630,
        y_pos: height * 3/4,
        height: 80,
        width: 200
    }, {
        x_pos: 1100,
        y_pos: height * 3/4,
        height: 170,
        width: 160
    }, {
        x_pos: 1000,
        y_pos: height * 3/4,
        height: 200,
        width: 230
    }, {
        x_pos: 1300,
        y_pos: height * 3/4,
        height: 100,
        width: 200
    }, {
        x_pos: 1300,
        y_pos: height * 3/4,
        height: 100,
        width: 200
    }, {
        x_pos: 1200,
        y_pos: height * 3/4,
        height: 150,
        width: 200
    }, {
        x_pos: 1800,
        y_pos: height * 3/4,
        height: 200,
        width: 200
    }, {
        x_pos: 3662,
        y_pos: height * 3/4,
        height: 200,
        width: 200
    }, {
        x_pos: 3602,
        y_pos: height * 3/4,
        height: 170,
        width: 200
    }, {
        x_pos: 3037,
        y_pos: height * 3/4,
        height: 170,
        width: 200
    }];
    
    
    // Collectable Set Up
    collectable = [{
        x_pos: 207, 
        y_pos: 433
    }, {
        x_pos: -260, 
        y_pos: 433
    }, {
        x_pos: -500, 
        y_pos: 433
    }, {
        x_pos: -700, 
        y_pos: 433
    }, {
        x_pos: 600,
        y_pos: 433
    }, {
        x_pos: 1200,
        y_pos: 433
    }, {
        x_pos: 1900,
        y_pos: 433
    }, {
        x_pos: 3242,
        y_pos: 433
    }, {
        x_pos: 3852,
        y_pos: 433
    }, {
        x_pos: 1527,
        y_pos: 433
    }];
    
    
    // Canyon Set Up
    canyons = [{
        x_pos: 90,
        y_pos: (height * 3/4),
        width: 150
    }, {
        x_pos: -400,
        y_pos: (height * 3/4),
        width: 150
    }, {
        x_pos: -1300,
        y_pos: (height * 3/4),
        width: 1000
    }, {
        x_pos: 914,
        y_pos: 576,
        width: 160
    }, {
        x_pos: 1658,
        y_pos: 576,
        width: 210
    }, {
        x_pos: 2108,
        y_pos: 576,
        width: 150
    }, {
        x_pos: 2500,
        y_pos: 576,
        width: 150
    }, {
        x_pos: 3400,
        y_pos: 576,
        width: 210
    }, {
        x_pos: 4250,
        y_pos: 576,
        width: 300
    }];
    
    
    // Flag 
    
    flagpole = {
        x_pos: 4000,
        isReached: false
    }
    
    // Spikes
    
    spikesArray = [ {
        x_pos: 1000, 
        y_pos: 433
    },  {
        x_pos: -650, 
        y_pos: 433
    }, {
        x_pos: 2250, 
        y_pos: 433
    }, {
        x_pos: 3000, 
        y_pos: 433
    }, {
        x_pos: 3100, 
        y_pos: 433
    }];
    
    
    // Comet
    comet = {
        x_pos: 2900,
        y_pos: 0
    };
    
    
    // Decrease life each time the game resets
    lives = lives - 1;
    
    
}
