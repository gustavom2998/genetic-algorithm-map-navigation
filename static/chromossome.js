/* 	Project name: Genetic Algorithm Visualization
	Project author: Gustavo Fardin Monti.
	The P5.JS library was used. Visit the website to know more: https://p5js.org/
	Feel free to contact me at gustavo_m@hotmail.co.uk */
// Individual chromossome found in the genetic algorithm class. Used to represent a collection of possible player moves.
class Chromossome{
  //  chromSize - The number of genes that exists in each chromossome. 
  //  chromGenes - The list containing the actual value of the genes for the particular chromossome. 
  //  chromFitness - The fitness score obtained by the fitness fuction for the particular chromossome. 
  //  chromType - "discrete" used for this project, planned to add "continuous".
  //  chromValues - Array of array, eah position is a gene, and in that position, is all the possible values that gene can assume.

  constructor(id,chromSize,chromType,chromValues){
    this.chromSize = chromSize;
    this.chromGenes = [];
    this.chromFitness = 0;
    this.chromType = chromType;
    this.chromValues = chromValues;
  
    // Discrete type - Insertion of a random number in the list for each gene
    if(chromType == "discrete"){
      for(let i = 0; i < chromSize; i++) this.chromGenes.push(random(chromValues[i]));
    }
    else throw new Error("Invalid chromossome type!");
  }

  
  // Update the chromossomes fitness score based on an internal function - Note that function should only generate positive results, and reward higher fitness.
  updateFitness(number){
    let newFit = 0.001;
    // Rewards based on distance to the objetive
    if(this.chromType == "discrete"){
      // Finds the player who's fitness is being calculate
   	  let player = PLAYERS.playerArray[number];

      // Calculates inverse of manhattan distance between middle of player and middle of objective - rewards smaller distance
      //newFit = Math.exp(((-1)*1/10000000)*(abs(player.pos.x - player.objectivePos.x - (player.size.x/2)) + abs(player.pos.y - player.objectivePos.y - (player.size.y/2))));
      //newFit = 10/( abs(player.pos.x - player.objectivePos.x - (player.size.x/2)) + abs(player.pos.y - player.objectivePos.y - (player.size.y/2)));
      // Euclidean distance - Due to window size, the maximum it can be is dist(800,600) = 1000
      newFit = 1000 - abs(Math.sqrt(Math.pow((player.pos.x + (player.size.x/2)) - (player.objectivePos.x + player.size.x/2),2) +
                           Math.pow((player.pos.y + (player.size.y/2)) - (player.objectivePos.y + player.size.y/2),2)));
      
      // Normalized to be between 0 and 1 
      newFit = newFit / 1000; 

      // Sqrt: F'(sqrt(0)) is very large and gets smaller as x grows (Reward gets smaller the closer agents get to objective)
      newFit = Math.sqrt(newFit);

      // Rewarding on distance to population center - Scallable by Current Diversity - 
      newFit += (CURRENT_DIVERSITY ** (2))*(abs(player.pos.x - PLAYERS.avgPlayerPos.x) + abs(player.pos.y - PLAYERS.avgPlayerPos.y))/(20000);
      
      // If the player wins, further reward is given for minimizing number of steps to find objective
      if(player.state == "won"){
        newFit = newFit + (1000/player.numberMoves);
        // If players are winning, gradually decrease diversity
        if (CURRENT_DIVERSITY > 0) CURRENT_DIVERSITY = CURRENT_DIVERSITY - (DIVERSITY_FALLOFF/NUMBER_PLAYERS) * CURRENT_DIVERSITY;
      }
      else if(player.state == "dead") newFit = 0.001;
    }
    this.chromFitness = newFit;
  }
  
  // Activates mutation - assumes roll has already happened
  mutate(){
    let pos = int(random(0,this.chromSize));

    if(this.chromType == "discrete"){
      // Chosing random value from the list of values
      let oldGene = this.chromGenes[pos];
      let newGene = random(this.chromValues[0]);
      this.chromGenes[pos] = newGene;
    }
  }
  
  display(){
    print(`Size: ${this.chromSize} Genes:  ${this.chromGenes} Fitness: ${this.chromFitness}`);
  }
}