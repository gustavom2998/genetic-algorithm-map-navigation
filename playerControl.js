class PlayerControl{

	constructor(nPlayers,beginPos,objectivePos,playerSize){
		this.playerArray = [];
		this.playerObjective = objectivePos;
		this.nPlayers = nPlayers;
		this.movesDone = 0;
		this.playerSize = playerSize;
		this.avgPlayerPos = createVector(0,0); // Used to calculate diversity
		for(let i = 0; i < this.nPlayers; i++) this.playerArray.push(new Player(beginPos,playerSize,objectivePos));
	}

	move(){
		// IF THERE ARE MOVES LEFT FOR THE GENERATION
		if(NUMBER_GENERATION_FRAME < GA_MANAGER.chromSize){
			// Average position is reset every new move.
			this.avgPlayerPos.x = 0;
			this.avgPlayerPos.y = 0;
			let playersAlive = 0;
			
			for(let i = 0; i < this.nPlayers; i++){
				let move = GA_MANAGER.population[i].chromGenes[NUMBER_GENERATION_FRAME];
				this.playerArray[i].updatePos(move);
				if(this.playerArray[i].state == "alive"){
					this.avgPlayerPos.x += this.playerArray[i].pos.x;
					this.avgPlayerPos.y += this.playerArray[i].pos.y;
					playersAlive++;
				}
			}

			// draw objective
			fill(255,255,0);
			stroke(255,255,0);
			rect(this.playerObjective.x,this.playerObjective.y,this.playerSize.x,this.playerSize.y);
			NUMBER_GENERATION_FRAME++;

			this.avgPlayerPos.x = this.avgPlayerPos.x / playersAlive;
			this.avgPlayerPos.y = this.avgPlayerPos.y / playersAlive;
			// Drawing average position
			fill(255,0,0);
			circle(this.avgPlayerPos.x,this.avgPlayerPos.y,10);
			return 0;
		}
		// NEED TO START NEXT GENERATION
		else{
			GA_MANAGER.updateFitness();
			GA_MANAGER.newGeneration();
			NUMBER_GENERATION_FRAME = 0;
			NUMBER_GENERATION++;
			PLAYERS = new PlayerControl(NUMBER_PLAYERS,START_POS,OBJECTIVE_POS,PLAYER_SIZE);
			print(`GENERATION: ${NUMBER_GENERATION} BEST FIT: ${GA_MANAGER.chromBest.chromFitness} AVG FIT: ${GA_MANAGER.chromAvg}`);

			return 1;
		}
	}
}