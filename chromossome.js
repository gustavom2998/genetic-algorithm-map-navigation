// Chromossome attributes:
  /*  chromSize - The number of genes that exists in each chromossome. 
  //  chromType - Used to determine type of values occupying each gene. If it's "discrete", there shall be a list of values for each gene, which requires more steps. 
  //  chromValues - The values a gene can have. If chromType is "binary", can only be 1 or 0, no list is used.  If chromType is "discrete", must be a list of lists, so that for each gene, there is a list of its possible values. The list in position 1 will be the values the 1st gene can assume, etc.
  //  chromGenes - The list containing the actual value of the genes for the particular chromossome. 
  //  chromFitness - The fitness score obtained by the fitness fuction for the particular chromossome. 
  */
class Chromossome{
  
  // Description constructor: 
  /* Creates an unique randomly generated chromossome with size genes, of the the type real, binary, or discrete(with the given values);
  // INPUT: chromSize - Number of genes
  //        chromType - "discrete" or "binary"
  //        chromValues - if "binary" not used; if "descrete" list with values of each gene
  */   
  constructor(id,chromSize,chromType,chromValues){
    this.chromID = [];
    this.chromSize = chromSize;
    this.chromGenes = [];
    this.chromFitness = 0;
    this.chromType=chromType;
    this.chromValues = chromValues;
    this.chromID = NUMBER_COUNTER_CHROM % NUMBER_PLAYERS;
    NUMBER_COUNTER_CHROM ++;
  
    // Binary type 0 insertion of a 0 or 1 randomly for each gene
    if(chromType == "binary"){
      for(let i = 0; i < chromSize; i++) this.chromGenes.push(random([0,1]));
    }
    // Discrete type - Insertion of a random number in the list for each gene
    else if(chromType == "discrete"){
      for(let i = 0; i < chromSize; i++) this.chromGenes.push(random(chromValues[i]));
    }
    // else if(match(chromType("discrete")){}
    else throw new Error("Invalid chromossome type!");
  }

  
  // Update the chromossomes fitness score based on an internal function - Note that function should only generate positive results, and reward higher fitness.
  updateFitness(number){
    let newFit = 0;
    
    // Rewards on amount of 1's found in genes - should generate 1111...
    if(this.chromType == "binary"){
      
      for(let i = 0; i < this.chromSize; i++){
        if(i==0 && this.chromGenes[i] == 1) newFit++;
        else if(this.chromGenes[i] == 0 && i>0) newFit++;
      }
    }
    // Rewards based on distance to the objetive
    else if(this.chromType == "discrete"){
   	  let player = PLAYERS.playerArray[number];
      newFit = 1/( abs(player.pos.x - player.objectivePos.x - (player.size.x/2)) + abs(player.pos.y - player.objectivePos.y - (player.size.y/2)));
      newFit = newFit * (abs(player.usefulMoves.x) + abs(player.usefulMoves.y));
      if(player.state == "dead") newFit = 0;
    }
    
    this.chromFitness = newFit;
  }
  
  // Activates mutation - assumes roll has already happened
  mutate(){
    let pos = int(random(0,this.chromSize));
    if(this.chromType == "binary"){
      // Random bitflip
      this.chromGenes[pos] = abs(this.chromGenes[pos]-1);
    }
    else if(this.chromType == "discrete"){
      // Chosing random value from the list of values
      let oldGene = this.chromGenes[pos];
      let newGene = oldGene;
      while(newGene == oldGene){
        newGene = random(this.chromValues[0]);
      }
      //print(`Mutate occured: ${oldGene} to ${newGene}`);
    }
  }
  
  display(){
    print(`Size: ${this.chromSize} Genes:  ${this.chromGenes} Fitness: ${this.chromFitness}`);
  }
}