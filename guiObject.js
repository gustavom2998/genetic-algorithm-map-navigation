class guiObject{

	constructor(pos,size, text, mode){
		this.pos = createVector(pos.x,pos.y);
		this.size = createVector(size.x,size.y);
		this.text = text;
		this.mode = mode; // 0 - Button; 1 - Dec/Inc Button; 2- Scrollbar;
		this.varText = [];
		this.bar = 0;



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
			this.bar = this.varText;
		}
		else if(this.text == "Diversity"){
			this.varText = CURRENT_DIVERSITY;
			this.bar = (15 - 1)/(50 - 1);
		}
		else if(this.text == "Fallof"){
			this.varText = DIVERSITY_FALLOFF.toFixed(2);
			this.bar = this.varText;
		}
		
	}

	draw(){
		
		
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

			textSize(16);
			fill(210);
			textAlign(CENTER,CENTER);
			text(this.text,this.pos.x,this.pos.y,this.size.x,this.size.y);
		}
		else if(this.mode == 1){
			// Main Box
			fill(red(GUI_COLOR) + 20,green(GUI_COLOR) + 20,blue(GUI_COLOR) + 20);
			rect(this.pos.x,this.pos.y,(3 *this.size.x / 4), this.size.y);
			textSize(14);

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

			// Scroll box
			fill(red(GUI_COLOR) + 50,green(GUI_COLOR) + 50,blue(GUI_COLOR) + 50);
			rect(this.pos.x,this.pos.y + (3*this.size.y/4),this.size.x, this.size.y/4);

			// Tiny box
			fill(red(GUI_COLOR) + 30,green(GUI_COLOR) + 30,blue(GUI_COLOR) + 30);
			stroke(red(GUI_COLOR),green(GUI_COLOR),blue(GUI_COLOR));
			rect(this.pos.x + ((this.size.x - this.size.y/4) * this.bar),this.pos.y + (3*this.size.y/4),(this.size.y/4),(this.size.y/4));

		}
	}

	isPressed(mx,my){
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
				GA_MANAGER = new GeneticAlgorithm("uniform","rank","discrete",PERMIT_ARRAY,NUMBER_MOVES,NUMBER_PLAYERS,P_MUTATION,P_CROSSOVER,P_ELITISM);
				print(`GA INITIATED: Crossover: ${P_CROSSOVER} Elitism:${P_ELITISM} Mutation:${P_MUTATION}`)
			}
			else if(this.text == "Draw" && (TOOL != 2 && TOOL != 3)) TOOL = 3;
			else if(this.text == "Delete" && (TOOL != 2 && TOOL != 4)) TOOL = 4;
			else if(this.text == "Player Pos." && (TOOL != 2 && TOOL != 5)) TOOL = 5;
			else if(this.text == "Goal Pos." && (TOOL != 2 && TOOL != 6)) TOOL = 6;
			else if(this.text == "Crossover" && (TOOL != 2 && TOOL != 7)) TOOL = 7;
			else if(this.text == "Elitism" && (TOOL != 2 && TOOL != 8)) TOOL = 8;
			else if(this.text == "Mutation" && (TOOL != 2 && TOOL != 9)) TOOL = 9;
			else if(this.text == "Diversity" && (DIVERSITY_TOOL == 0)) DIVERSITY_TOOL = 1;
			
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