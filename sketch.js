let i,max,a = [];


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
  
}