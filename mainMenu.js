/* 	Project name: Genetic Algorithm Visualization
	Project author: Gustavo Fardin Monti.
	The P5.JS library was used. Visit the website to know more: https://p5js.org/
	Feel free to contact me at gustavo_m@hotmail.co.uk */

/////////////////////////////// VARIABLE DECLERATION ///////////////////////////////
// Simulation Configuration
let NUMBER_PLAYERS;				// Number of players per generation (size of generation)
let NUMBER_MOVES;				// Maximum number of moves per player
let NUMBER_GENERATION;			// The number of the generation for the current execution (reset after every STOP)
let NUMBER_GENERATION_FRAME;	// The number of frames passed in the current generation (can be the number of moves made)
let PLAYER_VELOCITY;			// The number of spaces the player moves in a determined direction

// Simulation Variables
let PLAYERS = [];		// Object of type PlayerControl: Used to control the players positions, states, when they move, etc.
let OBSTACLES = [];		// Object-array of type Obstacle: Used to store the obstacles (positions and sizes), also used to check for collisions
let GA_MANAGER = [];	// Object of type GeneticAlgorithm: Stores the Genetic Algorithm, parameters, chromossomes, etc. Used to decide how players will move
let PERMIT_ARRAY = [];	// An array of the possible moves a player may make. 
let PERMIT_VALUES = [];	// A matrix containing all moves a player may make, for X steps.
let MAP_BORDER = 800;	// The X edge of the map the players may navigate. Allows to separete the GUI space
let DIVERSITY_WEIGHT;
let DIVERSITY_FALLOF;
let CURRENT_DIVERSITY;

// Individual Player Configuration
let START_POS;		// Vector containing the start position for all players
let OBJECTIVE_POS;	// Vector containing the objective position for all players.
let PLAYER_SIZE;	// Vector containg the X and Y size for all players.

// GUI Variables
let TOOL = 1; 			// 1 - Stopped, Customize, 2 - Execute GA, 3 - Draw Rect, 4 - Delete Rect, 5 - Change Initial player Pos, 6 - Change goal pos
let GUI_COLOR;			// Default color used for the GUI
let GUI_OBJECTS = [];	// Object-array of type GuiObject: Used to store interactible buttons and their functions
let BEGIN_RECT = [];	// Vector used to store the first pair of coordinates for a new obstacle.
let END_RECT = [];		// Vector used to store the second pair of coordinates for a new obstacle.
let TOGGLE_POP_CENTER;	// Used to decide whether to draw or not the red circle representing the average position of the population.

/////////////////////////////// VARIABLE SETUP ////////////////////////////////////
function setup() {
  createCanvas(1020,600);
  frameRate(100);

  NUMBER_PLAYERS = 200;
  NUMBER_GENERATION = 0;
  NUMBER_GENERATION_FRAME = 0;
  NUMBER_MOVES = 700;
  NUMBER_COUNTER_CHROM = 0;
  PLAYER_VELOCITY = 5;
  DIVERSITY_WEIGHT = 15;
  DIVERSITY_FALLOF = 0.1;
  CURRENT_DIVERSITY = DIVERSITY_WEIGHT;
  TOGGLE_POP_CENTER

  // Individual Player Configuration
  START_POS = createVector(200,200)
  OBJECTIVE_POS = createVector(700,280);
  PLAYER_SIZE = createVector(15,15);

  GUI_COLOR = color(60,60,80);
  PERMIT_VALUES = [0,1,2,3,5,6,7,8] // NW,N,NE,W,STAY,E,SW,S,SE

  // Setting up GUI array - adds all buttons to the array
  setupTabGA();
}

/////////////////////////////// MAIN LOOP /////////////////////////////////////////
function draw(){
  background(color(40,40,60));
  
  // Draws the GUI
  drawTabGA();

  // Draws the obstacles
  for(let i = 0; i < OBSTACLES.length; i++) OBSTACLES[i].draw();

  // Simulation executing
  if(TOOL == 2){
  	let res = PLAYERS.move();
  }

  // Drawing a new obstacle - shows obstacle being drawn until mouse release
  if(TOOL == 3 && mouseIsPressed && mouseX < MAP_BORDER){
  	let x1; let x2; let y1; let y2;
  	x1 = BEGIN_RECT.x;
  	x2 = mouseX;

  	y1 = BEGIN_RECT.y;
  	y2 = mouseY;

  	let aux = 0;
  	if(y2 < y1){
  		aux = y2;
  		y2 = y1;
  		y1 = aux;
  	}
  	if(x2 < x1){
  		aux = x2;
  		x2 = x1;
  		x1 = aux;
  	}

  	fill(50,50,70);
    stroke(100);
  	rect(x1,y1,x2-x1,y2-y1);
  }

  // Draw player at mouse if change position is selected, else draw it at default
  fill(0,255,0);
  stroke(100);
  if(TOOL == 5 && mouseX < MAP_BORDER) rect(mouseX,mouseY,PLAYER_SIZE.x,PLAYER_SIZE.y);
  else if(TOOL != 2) rect(START_POS.x,START_POS.y,PLAYER_SIZE.x,PLAYER_SIZE.y);

  // Draw objective at mouse if change goal position is selected, else draw it at default
  fill(255,255,0);
  stroke(255,255,0);
  if(TOOL == 6 && mouseX < MAP_BORDER) rect(mouseX,mouseY,PLAYER_SIZE.x,PLAYER_SIZE.y);
  else if(TOOL != 2) rect(OBJECTIVE_POS.x,OBJECTIVE_POS.y,PLAYER_SIZE.x,PLAYER_SIZE.y);
}

/////////////////////////////// AUXILIARY FUNCTIONS ///////////////////////////////
function setupTabGA(){
	// For each row, a Y value of 50 was used as an offset. 
	// For two buttons per row, the first button had an X offset of 10, size 95. The second button had an offset of 100 + 10 + 5.
	// First Row
	let runButtonPos = createVector(MAP_BORDER + 10,10)
	let runButtonSize = createVector(95,40);
	let runButton = new guiObject(runButtonPos,runButtonSize,"Run",0);

	let stopButtonPos = createVector(MAP_BORDER + 115,10)
	let stopButtonSize = createVector(95,40);
	let stopButton = new guiObject(stopButtonPos,stopButtonSize,"Stop",0);

	// Second row
	let drawButtonPos = createVector(MAP_BORDER + 10, 60);
	let drawButtonSize = createVector(95,40);
	let drawButton = new guiObject(drawButtonPos,drawButtonSize,"Draw", 0);

	let deleteButtonPos = createVector(MAP_BORDER + 115, 60);
	let deleteButtonSize = createVector(95,40);
	let deleteButton = new guiObject(deleteButtonPos,deleteButtonSize,"Delete", 0);

	// Third Row
	let initialButtonPos = createVector(MAP_BORDER + 10, 110);
	let initialButtonSize = createVector(95,40);
	let initialButton = new guiObject(initialButtonPos,initialButtonSize,"Player Pos.", 0);

	let goalButtonPos = createVector(MAP_BORDER + 115, 110);
	let goalButtonSize = createVector(95,40);
	let goalButton = new guiObject(goalButtonPos,goalButtonSize,"Goal Pos.", 0);

	// Fourth Row
	let popSizeButtonPos = createVector(MAP_BORDER + 10, 160);
	let popSizeButtonSize = createVector(200,40);
	let popSizeButton = new guiObject(popSizeButtonPos,popSizeButtonSize,"Pop. Size", 1);

	// Fifth row
	let nMovesButtonPos = createVector(MAP_BORDER + 10, 210);
	let nMovesButtonSize = createVector(200,40);
	let nMovesButton = new guiObject(nMovesButtonPos,nMovesButtonSize,"Moves", 1);
	
	// Adding buttons to the GUI_OBJECTS vector
	GUI_OBJECTS.push(runButton);
	GUI_OBJECTS.push(stopButton);
	GUI_OBJECTS.push(drawButton);
	GUI_OBJECTS.push(deleteButton);
	GUI_OBJECTS.push(initialButton);
	GUI_OBJECTS.push(goalButton);
	GUI_OBJECTS.push(popSizeButton);
	GUI_OBJECTS.push(nMovesButton);
}

// Drawing the Tab for the Genetic Algorithm GUI
function drawTabGA(){
	fill(GUI_COLOR);
	noStroke();
	rect(MAP_BORDER,0,220,600);


	for(let i = 0; i < GUI_OBJECTS.length; i++){
		GUI_OBJECTS[i].draw();
	}
	
}

// USER IO - Triggered when mouse is pressed. Allows switching betweens tools, also triggers begining of obstacle drawing.
function mousePressed(){
	let mx = mouseX;
	let my = mouseY;

	// If Draw/Delete is selected and click is on screen
	if(mx < MAP_BORDER && TOOL == 3){
		BEGIN_RECT = createVector(mx,my);
	}
	// Need to delete the object clicked
	else if(mx < MAP_BORDER && TOOL == 4){
		let collide = 0 ;
		let i = 0

		// Loop through obstacles array, and see if the mouse coordinates collide with an obstacle
		for(i= 0; i < OBSTACLES.length && !collide; i++){
			let r1p = createVector(mx,my);
			let r1s = createVector(1,1);
			collide = checkCollideRects(OBSTACLES[i].pos,OBSTACLES[i].size,r1p,r1s);
		}

		// If click collides with and obstacle, it is removed from the array
		if(collide) OBSTACLES.splice(i - 1, 1)
	}
	// Click in map, changes the spawn location
	else if(mx < MAP_BORDER && TOOL == 5){
		START_POS = createVector(mouseX,mouseY);
		TOOL = 1;
	}
	// Click in map, changes the objectve location
	else if(mx < MAP_BORDER && TOOL == 6){
		OBJECTIVE_POS = createVector(mouseX,mouseY);
		TOOL = 1;
	}
	// Else click is to change TOOL
	else{
		let collide = 0;
		let i = 0;

		// Loops checking if click has collided with a button coordinate
		for(i = 0; i < GUI_OBJECTS.length && !collide; i++){
			let r1p = createVector(mx,my);
			let r1s = createVector(1,1);
			collide = checkCollideRects(GUI_OBJECTS[i].pos,GUI_OBJECTS[i].size,r1p,r1s);

			if(collide) GUI_OBJECTS[i].isPressed(mx,my);
		}
	}
}

// USER IO - used to finalize drawing of obstacle
function mouseReleased(){
	// If Draw/Delete is selected and click is on screen
	if(mouseX < MAP_BORDER && TOOL == 3){
		END_RECT = createVector(mouseX,mouseY);

		// Garantee Begin X < End X & Begin Y < End Y
		let aux = 0;
		if(BEGIN_RECT.x > END_RECT.x){
			aux = BEGIN_RECT.x;
			BEGIN_RECT.x = END_RECT.x;
			END_RECT.x = aux;
		}
		if(BEGIN_RECT.y > END_RECT.y){
			aux = BEGIN_RECT.y;
			BEGIN_RECT.y = END_RECT.y;
			END_RECT.y = aux;
		}

		// Create obstacle and add to list
		let xSize = END_RECT.x - BEGIN_RECT.x;
		let ySize = END_RECT.y - BEGIN_RECT.y
		let newObs = new Obstacle(BEGIN_RECT,createVector(xSize,ySize));
		OBSTACLES.push(newObs);
		BEGIN_RECT = [];
		END_RECT = [];
	}
}

// Returns 1 if there is collision, 0 if there isnt - used throught out whole program
function checkCollideRects(rectPos1,rectSize1,rectPos2,rectSize2){
      // checking if player collided with objective
      if(rectPos1.x < rectPos2.x + rectSize2.x && 
         rectPos1.x + rectSize1.x > rectPos2.x && 
         rectPos1.y < rectPos2.y + rectSize2.y && 
         rectPos1.y + rectSize1.y > rectPos2.y){  
        return 1; // Collision
      }
      else return 0; // No collision
  }