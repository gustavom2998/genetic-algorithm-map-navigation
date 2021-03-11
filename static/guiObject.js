/* 	Project name: Genetic Algorithm Visualization
	Project author: Gustavo Fardin Monti.
	The P5.JS library was used. Visit the website to know more: https://p5js.org/
	Feel free to contact me at gustavo_m@hotmail.co.uk */
// Used to create and maintain the GUI. Very dependent on global variables. Also very tied in to the rest of the classes.
// Any change here will probably effect most of the other classes, since global variables are frequently update.
// Used to give the user complete control of the program state.
class guiObject{
	// Pos: Vector containing X and Y coordinates of the GUI rect.
	// Size: Vector containg the sizes along the X and Y axis for the GUI rect.
	// Text: Used as a name/key for the GUI element. Used for finding button objects and also displaying information.
	// Mode: Different types of GUI objects created. 0 indicates a clicable button, 1 indicates a button with increment and decrement buttons, and 2 indicates an interactable scrollbar.
	// Vartext: Used for storing text displayed in the GUI element that can change during execution. Update can be triggered by mousePress/release in main.
	// Bar: Only used for interactible scrollbar. Contains the scrollbar position. Update is trigerred by mouseRelease in main.

	constructor(pos,size, text, mode){
		this.pos = createVector(pos.x,pos.y);
		this.size = createVector(size.x,size.y);
		this.text = text;
		this.mode = mode; // 0 - Button; 1 - Dec/Inc Button; 2- Scrollbar;
		this.varText = [];
		this.bar = 0;

		// Different types of initialization for each Element, since each one displays different information. Here we assign what information that button displays.
		if(this.text == "Pop. Size") this.varText = ": " + NUMBER_PLAYERS;
		else if(this.text == "Moves") this.varText = ": " + NUMBER_MOVES;
		else if(this.text == "Crossover"){
			this.varText = P_CROSSOVER.toFixed(2);
			this.bar = this.varText;
		}
		else if(this.text == "Elitism"){
			this.varText = P_ELITISM.toFixed(2);
			this.bar = this.varText;
		}
		else if(this.text == "Mutation"){
			this.varText = P_MUTATION.toFixed(2);
			this.bar = this.varText;
		}
		else if(this.text == "Player Size"){
			this.varText = PLAYER_SIZE.x;
			this.bar = (15 - 5) / (30 - 5);
		}
		else if(this.text == "Diversity"){
			this.varText = CURRENT_DIVERSITY;
			this.bar = (1 - 0)/(5 - 0);
		}
		else if(this.text == "Falloff"){
			this.varText = DIVERSITY_FALLOFF.toFixed(2);
			this.bar = (DIVERSITY_FALLOFF - 0);
		}
		else if(this.text == "Selection Method:") this.varText = SELECTION_METHOD;
		else if(this.text == "Crossover Method:") this.varText = CROSSOVER_METHOD
		
	}
	
	// Used to draw the GUI element on canvas.
	draw(){
		// If it's a button, draws a rect, with different color depending if its selected or not. 
		if(this.mode == 0){
			if(TOOL == 5 && this.text == "Player Pos." ||
			   TOOL == 6 && this.text == "Goal Pos." ||
			   TOOL == 4 && this.text == "Delete" ||
			   TOOL == 3 && this.text == "Draw" || 
			   TOOL == 2 && this.text == "Run" || 
			   TOOL == 1 && this.text == "Stop"){
				fill(red(GUI_COLOR) + 40,green(GUI_COLOR) + 40,blue(GUI_COLOR) + 40);
			}
			else{
				fill(red(GUI_COLOR) + 20,green(GUI_COLOR) + 20,blue(GUI_COLOR) + 20);
			}
			
			rect(this.pos.x,this.pos.y,this.size.x,this.size.y);

			// Setup text drawn on the button.
			textSize(16);
			fill(210);
			textAlign(CENTER,CENTER);
			if(this.text == "Selection Method:" || this.text == "Crossover Method:"){
				textSize(14);
				textAlign(CENTER,CENTER);
				text(this.text + " " + this.varText,this.pos.x,this.pos.y,this.size.x,this.size.y);
			}
			else text(this.text,this.pos.x,this.pos.y,this.size.x,this.size.y);
		}
		// If its a button with increment/decrement, needs to configure and draw the 3 separate rects.
		else if(this.mode == 1){
			// Main Box
			fill(red(GUI_COLOR) + 20,green(GUI_COLOR) + 20,blue(GUI_COLOR) + 20);
			rect(this.pos.x,this.pos.y,(3 *this.size.x / 4), this.size.y);
			textSize(14);

			// Draw text for the main box
			fill(210);
			textAlign(CENTER,CENTER);
			text(this.text + this.varText,this.pos.x,this.pos.y,(3 * this.size.x / 4),this.size.y);

			// Increment Box
			fill(red(GUI_COLOR) + 10,green(GUI_COLOR) + 50,blue(GUI_COLOR) + 10);
			rect(this.pos.x + (3 *this.size.x / 4),this.pos.y, (this.size.x / 4), (this.size.y / 2));
			textSize(20);
			fill(210);
			text(" + ",this.pos.x + (3 *this.size.x / 4),this.pos.y, (this.size.x / 4), (this.size.y / 2));

			// Decrement Box
			fill(red(GUI_COLOR) + 50,green(GUI_COLOR) + 10,blue(GUI_COLOR) + 10);
			rect(this.pos.x + (3 *this.size.x / 4),this.pos.y + (this.size.y / 2), (this.size.x / 4), (this.size.y / 2));
			textSize(20);
			fill(210);
			text(" - ",this.pos.x + (3 *this.size.x / 4),this.pos.y + (this.size.y / 2), (this.size.x / 4),(this.size.y / 2));
		}
		// Button containing a scrollbar, that has a little button which changes position along scrollbar.
		else if(this.mode == 2){
			// Main box
			fill(red(GUI_COLOR) + 20,green(GUI_COLOR) + 20,blue(GUI_COLOR) + 20);
			rect(this.pos.x,this.pos.y,this.size.x, (3*this.size.y/4));
			textSize(12);

			fill(210);
			textAlign(CENTER,CENTER);
			if(this.text ==  "Crossover" || this.text ==  "Mutation" || this.text ==  "Elitism" || this.text == "Falloff"){
				text(this.text + ": " + (100* this.varText).toFixed() + "%",this.pos.x,this.pos.y,this.size.x, (3*this.size.y/4));
			}
			else {
				text(this.text + ": " + this.varText,this.pos.x,this.pos.y,this.size.x, (3*this.size.y/4));
			}

			// Scroll box - Long rectangle on bottom
			fill(red(GUI_COLOR) + 50,green(GUI_COLOR) + 50,blue(GUI_COLOR) + 50);
			rect(this.pos.x,this.pos.y + (3*this.size.y/4),this.size.x, this.size.y/4);

			// Tiny box - Used to configure value of bar
			fill(red(GUI_COLOR) + 30,green(GUI_COLOR) + 30,blue(GUI_COLOR) + 30);
			stroke(red(GUI_COLOR),green(GUI_COLOR),blue(GUI_COLOR));
			rect(this.pos.x + ((this.size.x - this.size.y/4) * this.bar),this.pos.y + (3*this.size.y/4),(this.size.y/4),(this.size.y/4));

		}
	}

	// This method is called once the main detects a mouse click that collided with the object.
	isPressed(mx,my){
		// Will actualy change the program state variables, trigerring events in the next frame.
		if(this.mode == 0 || this.mode == 2){
			if(this.text == "Stop") TOOL = 1;
			else if(this.text == "Run"){
				TOOL = 2;
				// Need to reset variables for new begin	
  				NUMBER_GENERATION_FRAME = 0;
				NUMBER_GENERATION = 0;
				PERMIT_ARRAY = [];
  				for(let i = 0; i < NUMBER_MOVES; i++) PERMIT_ARRAY.push(PERMIT_VALUES);
				
				CURRENT_DIVERSITY = DIVERSITY_WEIGHT;
				PLAYERS = new PlayerControl(NUMBER_PLAYERS,START_POS,OBJECTIVE_POS,PLAYER_SIZE);
				GA_MANAGER = new GeneticAlgorithm(CROSSOVER_METHOD,SELECTION_METHOD,"discrete",PERMIT_ARRAY,NUMBER_MOVES,NUMBER_PLAYERS,P_MUTATION,P_CROSSOVER,P_ELITISM);
			}
			else if(this.text == "Draw" && (TOOL != 2 && TOOL != 3)) TOOL = 3;
			else if(this.text == "Delete" && (TOOL != 2 && TOOL != 4)) TOOL = 4;
			else if(this.text == "Player Pos." && (TOOL != 2 && TOOL != 5)) TOOL = 5;
			else if(this.text == "Goal Pos." && (TOOL != 2 && TOOL != 6)) TOOL = 6;
			else if(this.text == "Crossover" && (TOOL != 2 && TOOL != 7)) TOOL = 7;
			else if(this.text == "Elitism" && (TOOL != 2 && TOOL != 8)) TOOL = 8;
			else if(this.text == "Mutation" && (TOOL != 2 && TOOL != 9)) TOOL = 9;
			else if(this.text == "Player Size" && (TOOL != 2 && TOOL != 10)) TOOL = 10;
			else if(this.text == "Diversity" && (DIVERSITY_TOOL == 0)) DIVERSITY_TOOL = 1;
			else if(this.text == "Falloff" && (DIVERSITY_TOOL == 0)) DIVERSITY_TOOL = 2;
			else if(this.text == "Selection Method:" && (TOOL != 2 && TOOL != 11)) TOOL = 11;
			else if(this.text == "Crossover Method:" && (TOOL != 2 && TOOL != 12)) TOOL = 12;
			
		}
		// Only allow to access these buttons while stopped
		else if(this.mode == 1 && TOOL == 1){
			// Increment button pressed
			if(mx >= this.pos.x + (3 *this.size.x / 4) && my < this.pos.y + (this.size.y / 2)){
				if(this.text == "Pop. Size" && NUMBER_PLAYERS < 999){
					NUMBER_PLAYERS = NUMBER_PLAYERS + 5;
					this.varText = ": " + NUMBER_PLAYERS;
				}
				if(this.text == "Moves" && NUMBER_MOVES < 999){
					NUMBER_MOVES = NUMBER_MOVES + 10;
					this.varText = ": " + NUMBER_MOVES;
				}
			}
			// Decrement button pressed
			else if(mx >= this.pos.x + (3 *this.size.x / 4) && my >= this.pos.y + (this.size.y / 2)){
				if(this.text == "Pop. Size" && NUMBER_PLAYERS > 10){
					NUMBER_PLAYERS = NUMBER_PLAYERS - 5;
					this.varText = ": " + NUMBER_PLAYERS;
				}
				if(this.text == "Moves" && NUMBER_MOVES > 50){
					NUMBER_MOVES = NUMBER_MOVES - 10;
					this.varText = ": " + NUMBER_MOVES
				}
			}

		}
	}
	
}