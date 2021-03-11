/* 	Project name: Genetic Algorithm Visualization
	Project author: Gustavo Fardin Monti.
	The P5.JS library was used. Visit the website to know more: https://p5js.org/
	Feel free to contact me at gustavo_m@hotmail.co.uk */
// Used to store and control all the individual player objects. Interfaces between players and the GA.
class PlayerControl{
	// playerArray: Array containing the population. (The GA population is a representation to find a strategy, this population actually interacts with the environment.)
	// playerObjective: Vector containing X and Y information for the objective of the player. (redundant for bug checking).
	// nPlayers: Number of players in the population. Determines how many players and also chromossomes are created.
	// movesDone: How many moves all of the players have completed. Once this reaches the maximum, a player population is created.
	// playerSize: Vector containing x and y sizes of the player. (redundant for bug checking).
	// avgPlayerPos: Used to display the centroid of the population position, and also for diversity calculates.
	
	constructor(nPlayers,beginPos,objectivePos,playerSize){
		this.playerArray = [];
		this.playerObjective = objectivePos;
		this.nPlayers = nPlayers;
		this.movesDone = 0;
		this.playerSize = playerSize;
		this.avgPlayerPos = createVector(0,0); // Used to calculate diversity

		// Initializes the player population spawning and beginPos. Their goals are to reach objective pos.
		for(let i = 0; i < this.nPlayers; i++) this.playerArray.push(new Player(beginPos,playerSize,objectivePos));
	}
	
	// Returns 0 if a move was correctly done, returns 1 if a new generation was made.
	move(){
		// IF THERE ARE MOVES LEFT FOR THE GENERATION
		if(NUMBER_GENERATION_FRAME < GA_MANAGER.chromSize){
			// Average position is reset every new move.
			this.avgPlayerPos.x = 0;
			this.avgPlayerPos.y = 0;
			let playersAlive = 0;
			
			// For each player, check if their moves are valid
			for(let i = 0; i < this.nPlayers; i++){
				let move = GA_MANAGER.population[i].chromGenes[NUMBER_GENERATION_FRAME];
				this.playerArray[i].updatePos(move);
				// If the player is still alive after the move, include him in average position calculation
				if(this.playerArray[i].state == "alive"){
					this.avgPlayerPos.x += this.playerArray[i].pos.x;
					this.avgPlayerPos.y += this.playerArray[i].pos.y;
					playersAlive++;
				}
			}

			// Draw objective
			fill(255,255,0);
			stroke(255,255,0);
			rect(this.playerObjective.x,this.playerObjective.y,this.playerSize.x,this.playerSize.y);
			NUMBER_GENERATION_FRAME++;


			// Calculate centroid
			this.avgPlayerPos.x = this.avgPlayerPos.x / playersAlive;
			this.avgPlayerPos.y = this.avgPlayerPos.y / playersAlive;

			// Drawing average position
			stroke(0,0,0)
			fill(50,200,50);
			circle(this.avgPlayerPos.x,this.avgPlayerPos.y,10);
			return 0;
		}
		// NEED TO START NEXT GENERATION
		else{
			// Update the fitness of the chromossome population
			GA_MANAGER.updateFitness();

			// Create new generation of chromossomes
			GA_MANAGER.newGeneration();

			// Reset generation variables
			NUMBER_GENERATION_FRAME = 0;
			NUMBER_GENERATION++;

			// Player population is reset, since we want them to restart. "Knowledge" is kept in chromossome population, which isn't reset
			PLAYERS = new PlayerControl(NUMBER_PLAYERS,START_POS,OBJECTIVE_POS,PLAYER_SIZE);
			
			return 1;
		}
	}
}