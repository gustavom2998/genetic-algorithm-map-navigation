/*  Project name: Genetic Algorithm Visualization
  Project author: Gustavo Fardin Monti.
  The P5.JS library was used. Visit the website to know more: https://p5js.org/
  Feel free to contact me at gustavo_m@hotmail.co.uk */
// Used to store chromossomes, initialize and breed populations. 
class GeneticAlgorithm{
    //  crossoverType - "one point", "two point" or "uniform". Describes method for selecting genes for crossover. See readme for more information.
    //  selectionType - "roulette", "rank", "tournament2" or "tournament4".  Describes method for selecting individuals for crossover. See readme for more information.
    //  chromType - "discrete", planned to add "continuous". See Chromosome Class.
    //  chromValues - Array containing possible values for each gene. See Chromosome Class.
    //  chromSize - Number of genes in each chromosome. 
    //  popSize - Population size / Number of chromosomes used. 
    //  probMutation - Probability (between 0 and 1) of the next generation that will come 
    //  probCrossover - Percentage (between 0 and 1) of the next generation that will come from crossover.
    //  probElitism - Percentage (between 0 and 1) of the next generation that will come from elitism.
    //  chromBest - The best chromosome from the current/last generation.
    //  chromAvg - The average fitness score for the current/last generation.
    //  chromTotal - The average fitness score for the current/last generation.
    //  population - Array of chromosomes - used to the store population.
  
  constructor(crossoverType,selectionType,chromType,chromValues,chromSize,popSize,probMutation,probCrossover,probElitism){
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
    this.chromTotal = 0;
    this.population = [];

    // Initializes chromosome population.
    let i = 0;
    while(i < this.popSize){
      this.population.push(new Chromossome(i,this.chromSize,this.chromType,this.chromValues));
       i++;
    }
  }

  // Used to log chromossome data to the console
  viewPopulation(){
    for(let i = 0; i < this.popSize; i++){
      print(`Chromossome ${i}:Type:${this.population[i].chromType}  ${this.population[i].chromGenes} Fitness: ${this.population[i].chromFitness}`);
    }
  }
  
  // Updates each the chromossomes fitness values, average fitness and the best chromossome - uses fitness function defined within Chromossome class
  updateFitness(){
    // Updates fitness for each chromosome and accumulates new fitness values
    let newAvg = 0;
    for(let i = 0; i < this.popSize;i++){
      this.population[i].updateFitness(i);
      
      newAvg+= this.population[i].chromFitness;
    }
    // Calculates average fitness 
    this.chromTotal = newAvg;
    this.chromAvg = newAvg/this.popSize;
    
    // Sorting population by fitness (First position is highest fitness)
    this.population.sort(function(var1, var2){
      if(var1.chromFitness <= var2.chromFitness) return 1;
      else return -1;
      }
    );

    // Stores the chromosome with the best fitness
    this.chromBest = this.population[0];
  }
  
  // Given two chromossomes A and B generates and returns a new chromosome. There a three types of cross-over available: 
  //    "one point": makes one random incision point to make the new chromosome A-pos-B.
  //    "two point": makes two random incision points to make the new chromosome A-pos1-B-pos2-A.
  //    "uniform": draws randomly between A or B for each gene. 
  crossOver(chromOne,chromTwo){
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
      // Generating the two positioins in the interval [0,chromSize) - Does not include chromSize
      let pos1 = int(random(0,this.chromSize)); 
      let pos2 = int(random(0,this.chromSize));

      // If they are the same, regenerates until they're different
      while(pos2 == pos1) pos2 = int(random(0,this.chromSize));

      // Guarantees pos 2 will always be bigger
      if(pos1>pos2){ let aux = pos1; pos1 = pos2; pos2 = aux;} 
      
      // Copies the genes
      for(let i = 0; i<this.chromSize; i++){
        if(i<pos1 || i>=pos2) newChrom.chromGenes[i] = chromOne.chromGenes[i]; // Copies from [0,pos1) and [pos2,chromSize)
        else newChrom.chromGenes[i] = chromTwo.chromGenes[i]; // Copies from [pos1,pos2)
      }
    }

    // Generates a random number for each gene to decide if it's using A or B gene
    else if(this.crossoverType == "uniform"){
      for(let i = 0; i < this.chromSize; i++){
        // Generates either the number 0 or 1
        let rand = random([0,1]);  

        // Copies genes from A or B based on the number generated
        if(rand == 0) newChrom.chromGenes[i] = chromOne.chromGenes[i];
        else newChrom.chromGenes[i] = chromTwo.chromGenes[i];
      }
    }
    
    // Rolls for mutation
    let mutateRoll = random();
    
    // If roll is smaller than probMutation, mutates. 
    if(this.probMutation-mutateRoll > 0) newChrom.mutate();
    
    return newChrom;
  }
  
  // Creates a new generation based on the old one. 
  newGeneration(){
    let newPop = [];
    
    // Generating crossover for the pre-defined proportion of the population
    for(let i = 0; i < int(this.popSize*this.probCrossover); i++){
      let first = []; 
      let second = [];

      // Selection based on the fitness function
      if(this.selectionType == "roulette"){
        // Picking first parent 
        let rand = random(0,this.chromTotal); // Generate random number between 0 and the total fitness for the generation
        let partialSum = 0; // Used to acumulate the fitness of each chromosome
        let aux = 0;        // Used to determine position of current chromosome

        // Acumulates fitness for each chrom - If the acumulated value exceeds the random value, the current chrom is selected. Smaller fit -> Less likely to be selected
        for(let j = 0; j < this.popSize && partialSum < rand; j++){
          partialSum+= this.population[j].chromFitness;
          if(partialSum < rand) aux++;
        }
        
        // Picks the player at the position
        first = this.population[aux]
        
         // Picking second parent - repeats the same process
        rand = random(0,this.chromTotal);
        partialSum = 0;
        aux = 0;

        // Acumulates fitness for each chrom
        for(let j = 0; j < this.popSize && partialSum < rand; j++){
          partialSum+= this.population[j].chromFitness;
          if(partialSum < rand) aux++;
        }

        // Picks the second player at the position aux
        second = this.population[aux]
      }

      // Rank based cross over selection - Less dependent on fitness function than roulette method
      else if(this.selectionType == "rank"){
        // Finding first player
        let rankSum = (this.popSize*(this.popSize + 1)) / 2; // Simplification of arithmetic series: 1 + 2 + ... + popSize
        let partialSum = 0;
        let rand = random(0,rankSum);
        let aux = 0;

        // While the acumulated sum is smaller than the random number, keeps going foward. Instead of fitness, uses rank. 
        for(let j = this.popSize; j > 0 && partialSum < rand; j--){
          partialSum+= j;
          if(partialSum < rand) aux++;
        }

        // Picks first player
        first = this.population[aux];

        // Finding second player
        partialSum = 0;
        rand = random(0,rankSum);
        aux = 0;

        for(let j = this.popSize; j > 0 && partialSum < rand; j--){
          partialSum+= j;
          if(partialSum < rand) aux++;
        }

        // Picks second player
        second = this.population[aux];
      }
      // Implemented 2 and 4 Person Tournament - Perfomed twice to find parents
      else if(this.selectionType == "tournament2" || this.selectionType == "tournament4"){
        let auxC1 = []
        let j = 0
        let tournamentSize = 0;
        if(this.selectionType == "tournament2") tournamentSize = 2;
        else tournamentSize = 4;

        // Finding the first parent - first tournament is hosted
        for(j = 0; j < tournamentSize; j++){
          let aux = Math.floor(Math.random() * this.popSize) // Random number between 0 and popSize - 1

          if(j == 0) auxC1 = this.population[aux] // If it's the first parent, initializes the aux
          else{ // else, tests if fitness is larger and updates the best parent
            if(auxC1.chromFitness < this.population[aux].chromFitness){
              auxC1 = this.population[aux]
            }
          }
        }
        let auxC2 = []
        // Finding the second parent - second tournament is hosted
        for(j = 0; j < tournamentSize; j++){
          let aux = Math.floor(Math.random() * this.popSize) // Random number between 0 and popSize - 1

          // If it's the first parent, initializes the aux, else, tests if fitness is larger and updates the best parent
          if(j == 0) auxC2 = this.population[aux]
          else{
            if(auxC2.chromFitness < this.population[aux].chromFitness){
              auxC2 = this.population[aux]
            }
          }
        }

        first = auxC1;
        second = auxC2;
      }

      // New chromosome produced by the crossover of the 1st and 2nd parent is pushed into the new population
      newPop.push(this.crossOver(first,second));
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

    this.population = newPop;
  }
  
}