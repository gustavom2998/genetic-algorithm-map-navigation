class GeneticAlgorithm{
  // GeneticAlgorithm attributes:
  /*    crossoverType - "one point", "two point" or "uniform" 
    //  chromType - "binary" or "discrete"
    //  chromValues -
    //  chromSize
    //  popSize
    //  probMutation
    //  probCrossover
    //  probElitism
    //  population
    //  chromBest
    //  chromAvg
    */
  
  constructor(crossoverType,selectionType,chromType,chromValues,chromSize,popSize,probMutation,probCrossover,probElitism){
  // Description constructor: 
  /*General constructor method for a general purpose genetic algorithm. This object is used to keep the struct and metrics of the algorithm.
  // INPUT: crossoverType - 
  //        chromType -
  //        chromValues -
  //        popSize -
  //        probMutation -
  //        probCrossover -
  //        probElitism -    
  */ 
    this.crossoverType = crossoverType;
    this.selectionType = selectionType;
    this.chromType = chromType;
    this.chromValues = chromValues;
    this.chromSize = chromSize;
    this.popSize = popSize || 10; 
    this.probMutation = probMutation || 0.1;
    this.probCrossover = probCrossover || 0.8;
    this.probElitism = probElitism || 0.1;
    this.chromBest = null;
    this.chromAvg = -Infinity;
    this.chormTotal = 0;
    this.population = [];  

    let i = 0;

    while(i < this.popSize){
      this.population.push(new Chromossome(i,this.chromSize,this.chromType,this.chromValues));
       i++;
    }
  }

  viewPopulation(){
  // Description viewPopulation:
  /*
  // INPUT: Void OUTPUT:Void
  */
    for(let i = 0; i < this.popSize; i++){
      print(`Chromossome ${i}:Type:${this.population[i].chromType}  ${this.population[i].chromGenes} Fitness: ${this.population[i].chromFitness}`);
    }
  }
  
  updateFitness(){
  // Description updateFitness
  /* Updates each the chromossomes fitness values, average fitness and the best chromossome
  // INPUT: Void OUTPUT:Void
  */
    let newAvg = 0;
    for(let i = 0; i < this.popSize;i++){
      
      this.population[i].updateFitness(i);
      
      newAvg+= this.population[i].chromFitness;
      
      //if(this.chromBest == null) {this.chromBest = this.population[i];}
      //else if (this.chromBest.chromFitness < this.population[i].chromFitness) this.chromBest = this.population[i].chromFitness
    }
    this.chromTotal = newAvg;
    this.chromAvg = newAvg/this.popSize;
    
    // Sorting population by fitness
    this.population.sort(function(var1, var2){
      if(var1.chromFitness < var2.chromFitness) return 1;
      else return -1;
      }
    );

    /*for(let i = 0;  i < 100; i++){
      print(`i:${i} chromID ${this.population[i].chromID} chromFit ${this.population[i].chromFitness}`);
    }*/
    this.chromBest = this.population[0];
  }
  
  crossOver(chromOne,chromTwo){
  // Description crossOver: 
  /* Given two chromossomes A and B generates a new chromossome. There a three types of cross-over available: "one point","two point" or "uniform". available.  The first chooses one incision point to make the new gene A-pos-B. The second makes two incision points to make the new gene A-pos1-B-pos2-A. The last one draws randomly between A or B for each position. 
  // INPUT: Chromossome A, Chromossome B.
  // OUTPUT: The new chromossome
  */
    let newChrom = new Chromossome(0,this.chromSize,this.chromType,this.chromValues);
    
    // Generates one position where it's stops using A genes and uses B genes.
    if(this.crossoverType == "one point"){
      let pos = (int(random(0,this.chromSize))); // Generates position 0 up to chromSize - 1
      
      for(let i = 0; i<this.chromSize; i++){
        if(i<pos) newChrom.chromGenes[i] = chromOne.chromGenes[i]; // Copies from [0,pos)
        else newChrom.chromGenes[i] = chromTwo.chromGenes[i]; // Copies from [pos,chromSize)
      }
      
    }
    
    // Generates two positions where the swap occurs to generate the A-B-A pattern
    else if(this.crossoverType == "two point"){
      let pos1 = int(random(0,this.chromSize)); // Generates position 0 up to chromSize - 1
      let pos2 = int(random(0,this.chromSize)); // Generates position 0 up to chromSize - 1
      while(pos2 == pos1) pos2 = int(random(0,this.chromSize));
      if(pos1>pos2){ let aux = pos1; pos1 = pos2; pos2 = aux;} // Guarantees pos 2 will always be bigger
      
      for(let i = 0; i<this.chromSize; i++){
        if(i<pos1 || i>=pos2) newChrom.chromGenes[i] = chromOne.chromGenes[i]; // Copies from [0,pos1) and [pos2,chromSize)
        else newChrom.chromGenes[i] = chromTwo.chromGenes[i]; // Copies from [pos1,pos2)
      }
    }
    // Generates a random number for each gene to decide if it's using A or B gene
    else if(this.crossoverType == "uniform"){
      for(let i = 0; i < this.chromSize; i++){
        let rand = random([0,1]);  // Generates either the number 0 or 1
        if(rand == 0) newChrom.chromGenes[i] = chromOne.chromGenes[i];
        else newChrom.chromGenes[i] = chromTwo.chromGenes[i];
      }
    }
    
    let mutateRoll = random();
    
    if(this.probMutation-mutateRoll > 0) newChrom.mutate();
    
    return newChrom;
  }
  
  newGeneration(){
    // Description newGeneration: Creates a new generation based on the old one. 
  /* 
  // INPUT: V oid OUTPUT: Void
  */
    let newPop = [];
    
    if(this.selectionType == "roulette"){
      // Generating crossover for the pre-defined proportion of the population
      for(let i = 0; i < int(this.popSize*this.probCrossover); i++){
        // Picking first parent
        let rand = random(0,this.chromTotal);
        let partialSum = 0;
        let aux = 0;

        for(let j = 0; j < this.popSize && partialSum < rand; j++){
          partialSum+= this.population[j].chromFitness;
          if(partialSum < rand) aux++;
        }
       
        let first = this.population[aux]
        
         // Picking second parent
        rand = random(0,this.chromTotal);
        partialSum = 0;
        aux = 0;

        for(let j = 0; j < this.popSize && partialSum < rand; j++){
          partialSum+= this.population[j].chromFitness;
          if(partialSum < rand) aux++;
        }

        let second = this.population[aux]
        newPop.push(this.crossOver(first,second));
      
      }
    }
    else if(this.selectionType == "rank"){
    
    }
    let aux = 0; 
    
    // Elitism - Adding the pre-defined proportion of "elites" to the population
    for(let i = 0; i < int(this.popSize*this.probElitism) && newPop.length< this.population.length; i++){
      newPop.push(this.population[aux]);
      aux++;
    }

    
    // Choosing randomly for the remainder of the population
    while(newPop.length<this.population.length){
      let rand = int(random(0,this.population.length));
      newPop.push(this.population[rand]);
    }
    //this.population = [];
    this.population = newPop;
  }
  
}

/*let i,max,a = [];


function setup() {
  //createCanvas(400, 400);
  //noLoop();
  a = new GeneticAlgorithm("one point",  // Crossover type
                               "roulette", // Selection type
                               "binary",  // Chromossome type
                               0,  // Chromossome permited values  (only valid for discrete type)
                               15   // Chromossome size                              
                              );   // Chromossome value upper limit (for continuos
  i = 0; 
  max = 100;
  frameRate(5);
}

function draw() {
  if(i<max){
    a.updateFitness();
    print(`Generation: ${frameCount} Avg:  ${a.chromAvg} Best Fitness: ${a.population[0].chromFitness} Best: ${a.population[0].chromGenes}`);
    a.newGeneration();
    i++;
  }
  else{
  a.updateFitness();
  print(`Vencedor: ${a.population[0].chromGenes} Pontuacao:${a.population[0].chromFitness}`);
  }
  
}*/