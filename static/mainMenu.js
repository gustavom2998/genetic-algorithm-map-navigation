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
let DIVERSITY_WEIGHT;	// Minimum value of diversity: The smaller, the lesser the reward for diversity.
let DIVERSITY_FALLOFF;	// Fallof factor for diversity reward after a player reaches the objective
let CURRENT_DIVERSITY;	// Current diversity value
let P_MUTATION;			// probMutation for GA value
let P_ELITISM;			// probElitism for GA value
let P_CROSSOVER;		// probCrossover for GA value
let SELECTION_METHOD	// Selection method used for GA
let ARRAY_SELECTIONS_METHODS // Array containing selection methods
let CROSSOVER_METHOD	// Crossover method used for GA
let ARRAY_CROSSOVER_METHODS // Array containing crossover methods

// Individual Player Configuration
let START_POS;		// Vector containing the start position for all players
let OBJECTIVE_POS;	// Vector containing the objective position for all players.
let PLAYER_SIZE;	// Vector containg the X and Y size for all players.

// GUI Variables
let TOOL = 1; 			// 1 - Stopped, Customize, 2 - Execute GA, 3 - Draw Rect, 4 - Delete Rect, 5 - Change Initial player Pos, 6 - Change goal pos, 7 - Change prob crossover, 8 - Change Prob Elitism, 9 - Change prob mutation, 10 - change player size
let DIVERSITY_TOOL = 0 	// 1 - Maximum Diversity, 2 - Fallof
let GUI_COLOR;			// Default color used for the GUI
let GUI_OBJECTS = [];	// Object-array of type GuiObject: Used to store interactible buttons and their functions
let BEGIN_RECT = [];	// Vector used to store the first pair of coordinates for a new obstacle.
let END_RECT = [];		// Vector used to store the second pair of coordinates for a new obstacle.
let TOGGLE_POP_CENTER;	// Used to decide whether to draw or not the red circle representing the average position of the population.

/////////////////////////////// VARIABLE SETUP ////////////////////////////////////
function setup() {
  var cnv = createCanvas(1020,600);
  frameRate(300);
  cnv.parent('sketchholder');

  NUMBER_PLAYERS = 200;
  NUMBER_GENERATION = 0;
  NUMBER_GENERATION_FRAME = 0;
  NUMBER_MOVES = 150;
  NUMBER_COUNTER_CHROM = 0;
  PLAYER_VELOCITY = 5;
  DIVERSITY_WEIGHT = 1;
  DIVERSITY_FALLOFF = 0.5;
  CURRENT_DIVERSITY = DIVERSITY_WEIGHT;
  P_MUTATION = 0.1;
  P_ELITISM = 0.1;
  P_CROSSOVER = 0.7;
  TOGGLE_POP_CENTER = 0;
  SELECTION_METHOD = "rank"
  ARRAY_SELECTIONS_METHODS = ["roulette","rank","tournament2","tournament4"]
  CROSSOVER_METHOD = "one point"
  ARRAY_CROSSOVER_METHODS = ["one point","two point", "uniform"]


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
  // Draws the GUI - Allows for the user to change parameters without interacting with code
  drawTabGA();
  drawExecData();

  // Draws the existing obstacle objects - Begins with no obsticles
  for(let i = 0; i < OBSTACLES.length; i++) OBSTACLES[i].draw();

  // Simulation executing - This calls PlayerControl, which organizes the agents and uses the genetic algorithm
  if(TOOL == 2){
  	let res = PLAYERS.move();
  }

  // Drawing a new obstacle - shows obstacle being drawn until mouse release - only then is the object instanced
  if(TOOL == 3 && mouseIsPressed && mouseX < MAP_BORDER){
  	let x1; let x2; let y1; let y2;
  	// Capture coordinates for new being drawn obsticle
  	x1 = BEGIN_RECT.x;
  	x2 = mouseX;

  	y1 = BEGIN_RECT.y;
  	y2 = mouseY;

  	// Invert coordinates if the values are switched
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

  	// Drawing the temporary obsticle (only happens until mouse release)
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
// Setup function for initializing the user GUI seen on the right hand side of screen.
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

	// Sixth row
	let selectionMethodButtonPos = createVector(MAP_BORDER + 10, 260);
	let selectionMethodButtonSize = createVector(200,40);
	let selectionMethodButton = new guiObject(selectionMethodButtonPos,selectionMethodButtonSize,"Selection Method:", 0);

	// Seventh row
	let crossoverMethodButtonPos = createVector(MAP_BORDER + 10, 310);
	let crossoverMethodButtonSize = createVector(200,40);
	let crossoverMethodButton = new guiObject(crossoverMethodButtonPos,crossoverMethodButtonSize,"Crossover Method:", 0);

	// Eight row
	let crossOverPPos  = createVector(MAP_BORDER + 10, 360);
	let crossOverPSize  = createVector(95,40);
	let crossOverPButton = new guiObject(crossOverPPos,crossOverPSize,"Crossover", 2);

	let elitismPPos  = createVector(MAP_BORDER + 115, 360);
	let elitismPSize  = createVector(95,40);
	let elitismPButton = new guiObject(elitismPPos,elitismPSize,"Elitism", 2);

	// Ninth row
	let mutationPPos  = createVector(MAP_BORDER + 10, 410);
	let mutationPSize  = createVector(95,40);
	let mutationPButton = new guiObject(mutationPPos,mutationPSize,"Mutation", 2);

	let playerSizePos  = createVector(MAP_BORDER + 115, 410);
	let playerSizeSize  = createVector(95,40);
	let playerSizeButton = new guiObject(playerSizePos,playerSizeSize,"Player Size", 2);

	// Tenth row
	let diversityMaxPos = createVector(MAP_BORDER + 10, 460);
	let diversityMaxSize  = createVector(95,40);
	let diversityMaxButton = new guiObject(diversityMaxPos,diversityMaxSize,"Diversity", 2);

	let diversityFallPos = createVector(MAP_BORDER + 115, 460);
	let diversityFallSize  = createVector(95,40);
	let diversityFallButton = new guiObject(diversityFallPos,diversityFallSize,"Falloff", 2);
	
	// Adding buttons to the GUI_OBJECTS vector
	GUI_OBJECTS.push(runButton);
	GUI_OBJECTS.push(stopButton);
	GUI_OBJECTS.push(drawButton);
	GUI_OBJECTS.push(deleteButton);
	GUI_OBJECTS.push(initialButton);
	GUI_OBJECTS.push(goalButton);
	GUI_OBJECTS.push(popSizeButton);
	GUI_OBJECTS.push(nMovesButton);
	GUI_OBJECTS.push(selectionMethodButton);
	GUI_OBJECTS.push(crossoverMethodButton);
	GUI_OBJECTS.push(crossOverPButton);
	GUI_OBJECTS.push(elitismPButton);
	GUI_OBJECTS.push(mutationPButton);
	GUI_OBJECTS.push(playerSizeButton);
	GUI_OBJECTS.push(diversityMaxButton);
	GUI_OBJECTS.push(diversityFallButton);
}

// Drawing the GUI seen on the right hand side of the screen
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

	// If Draw is selected and click is on screen
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
	// User updated method, needs to update GUIObject
	else if( TOOL == 11 || TOOL == 12){
		// Scan through Selection methods
		let cont = 0;
		let i = 0;
		if(TOOL == 11){
			// Find position of current selection method
			for(i = 0; i < ARRAY_SELECTIONS_METHODS.length && ARRAY_SELECTIONS_METHODS[cont] != SELECTION_METHOD; i++){
				if(ARRAY_SELECTIONS_METHODS[i] == SELECTION_METHOD) cont = i;
			}
			cont = (cont + 1) % ARRAY_SELECTIONS_METHODS.length
			SELECTION_METHOD = ARRAY_SELECTIONS_METHODS[cont]
		}
		// Scan through Crossover methods
		else if(TOOL == 12){
			
			for(i = 0; i < ARRAY_CROSSOVER_METHODS.length && ARRAY_CROSSOVER_METHODS[cont] != CROSSOVER_METHOD; i++){
				if(ARRAY_CROSSOVER_METHODS[i] == CROSSOVER_METHOD) cont = i;
			}
			cont = (cont + 1) % ARRAY_CROSSOVER_METHODS.length
			CROSSOVER_METHOD = ARRAY_CROSSOVER_METHODS[cont]

		}

		// Update the GUIObjects
		i = 0;
		cont = 0;
		for(i = 0; i < GUI_OBJECTS.length && !cont; i++){
			if(TOOL == 11 && GUI_OBJECTS[i].text == "Selection Method:") cont = 1;
			if(TOOL == 12 && GUI_OBJECTS[i].text == "Crossover Method:") cont = 1;
		}
		if(cont) i--;
		if(TOOL == 11) GUI_OBJECTS[i].varText = SELECTION_METHOD;
		if(TOOL == 12) GUI_OBJECTS[i].varText = CROSSOVER_METHOD;
	}
	// User selected to adjust position for Percentage Slidebar
	else if(TOOL == 7 || TOOL == 8 || TOOL == 9 || TOOL == 10){
		// Find button index
		let cont = 0;
		let i = 0;

		for(i = 0; i < GUI_OBJECTS.length && !cont; i++){
			if(TOOL == 7 && GUI_OBJECTS[i].text == "Crossover") cont = 1; 
			if(TOOL == 8 && GUI_OBJECTS[i].text == "Elitism") cont = 1;
			if(TOOL == 9 && GUI_OBJECTS[i].text == "Mutation") cont = 1;
			if(TOOL == 10 && GUI_OBJECTS[i].text == "Player Size") cont = 1;
			if(DIVERSITY_TOOL == 1 && GUI_OBJECTS[i].text == "Diversity") cont = 1;
			if(DIVERSITY_TOOL == 2 && GUI_OBJECTS[i].text == "Falloff") cont = 1; 
		}

		if(cont) i--;
		let barLimit = GUI_OBJECTS[i].pos.x + GUI_OBJECTS[i].size.x - (GUI_OBJECTS[i].size.y/4);
		// Found button index (i)
		let test = 0;

		// Test if allowed to set value: Dont want Prob Crossover + Prob Elitism to be > 1
		if(mouseX < GUI_OBJECTS[i].pos.x) test = 0;
		else if(mouseX > barLimit ) test = 1;
		else{
			test = (mouseX - GUI_OBJECTS[i].pos.x) / (barLimit - GUI_OBJECTS[i].pos.x);
		}

		// Treatment for each slider
		if(TOOL == 7){
			// Probability of Crossover slider
			if(test + P_ELITISM < 1) GUI_OBJECTS[i].bar = test;
			else GUI_OBJECTS[i].bar = 1 - P_ELITISM - 0.01;
			P_CROSSOVER = GUI_OBJECTS[i].bar;
			GUI_OBJECTS[i].varText = GUI_OBJECTS[i].bar.toFixed(2);
		}
		else if(TOOL == 8){
			// Probability of Elitism slider
			if(test + P_CROSSOVER < 1) GUI_OBJECTS[i].bar = test;
			else GUI_OBJECTS[i].bar = 1 - P_CROSSOVER - 0.01;
			P_ELITISM = GUI_OBJECTS[i].bar;
			GUI_OBJECTS[i].varText = GUI_OBJECTS[i].bar.toFixed(2);
		}
		else if(TOOL == 9){
			// Probability of Mutation slider
			GUI_OBJECTS[i].bar = test;
			P_MUTATION = GUI_OBJECTS[i].bar;
			GUI_OBJECTS[i].varText = GUI_OBJECTS[i].bar.toFixed(2);
		}
		else if(TOOL == 10){
			// Player size configurationslider
			GUI_OBJECTS[i].bar = test
			PLAYER_SIZE = createVector(5 + int(25*test),5 + int(25*test))
			GUI_OBJECTS[i].varText = PLAYER_SIZE.x;
		}
		
		TOOL = 1;
	}
	else if(DIVERSITY_TOOL == 1 || DIVERSITY_TOOL == 2){
		// Find button index
		let cont = 0;
		let i = 0;


		for(i = 0; i < GUI_OBJECTS.length && !cont; i++){
			if(DIVERSITY_TOOL == 1 && GUI_OBJECTS[i].text == "Diversity") cont = 1; 
			if(DIVERSITY_TOOL == 2 && GUI_OBJECTS[i].text == "Falloff") cont = 1; 
		}

		if(cont) i--;
		let barLimit = GUI_OBJECTS[i].pos.x + GUI_OBJECTS[i].size.x - (GUI_OBJECTS[i].size.y/4);
		// Found button index (i)
		let test = 0;

		// Test if allowed to set value: Dont want Prob Crossover + Prob Elitism to be > 1
		if(mouseX < GUI_OBJECTS[i].pos.x) test = 0;
		else if(mouseX > barLimit ) test = 1;
		else{
			test = (mouseX - GUI_OBJECTS[i].pos.x) / (barLimit - GUI_OBJECTS[i].pos.x);
		}

		if(DIVERSITY_TOOL == 1){
			GUI_OBJECTS[i].bar = test;
			DIVERSITY_WEIGHT = test * 5;
			CURRENT_DIVERSITY = DIVERSITY_WEIGHT;
			GUI_OBJECTS[i].varText = DIVERSITY_WEIGHT.toFixed(1);
		}
		else if(DIVERSITY_TOOL == 2){
			GUI_OBJECTS[i].bar = test;
			DIVERSITY_FALLOFF = test;
			GUI_OBJECTS[i].varText = DIVERSITY_FALLOFF.toFixed(2);
		}
		DIVERSITY_TOOL = 0;
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

  // Used to display metrics/information about current execution.
 function drawExecData(){
 	fill(red(GUI_COLOR) + 15,green(GUI_COLOR) + 15,blue(GUI_COLOR) + 15);
  	rect(MAP_BORDER + 10, 510, 200, 80);

  	// Update Generation Text
	textSize(14);
	fill(210);
	textAlign(LEFT,TOP);
	let str_aux =  `Generation: ${NUMBER_GENERATION}\nBest fitness: ${GA_MANAGER.chromBest?GA_MANAGER.chromBest.chromFitness.toFixed(5):"NA"}\nAvg. fitness: ${GA_MANAGER.chromAvg?GA_MANAGER.chromAvg.toFixed(5):"NA"}\nCurrent Diversity: ${CURRENT_DIVERSITY.toFixed(2)}`
	text(str_aux,MAP_BORDER + 15, 515,200, 80);
 }