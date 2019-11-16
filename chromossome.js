// Chromossome attributes:
  /*  chromSize
  //  chromType
  //  chromValues
  //  chromSize
  //  chromGenes
  //  chromFitness
  */
class Chromossome{
  
  // Description constructor: 
  /* Creates an unique randomly generated chromossome with size genes, of the the type real, binary, or discrete(with the given values);
  // INPUT: chromSize -
  //        chromType -
  //        chromValues -
  //        lowerBound -
  //        upperBound - 
  */   
  constructor(chromSize,chromType,chromValues,lowerBound,upperBound){
    this.chromSize = chromSize;
    this.chromGenes = [];
    this.chromFitness = 0;
    this.chromType=chromType;
      
      
    // Binary type 0 insertion of a 0 or 1 randomly for each gene
    if(match(chromType,"binary")){
      for(let i = 0; i < chromSize; i++) this.chromGenes.push(random([0,1]));
    }
    // Real type - Insertion of a random number in interval for each gene
    else if(match(chromType,"real")){
      for(let i = 0; i < chromSize; i++) this.chromGenes.push(random(lowerBound,upperBound));
    }
    // else if(match(chromType("discrete")){}
    else throw new Error("Invalid chromossome type!");
  }
  
  get chromFitness(){
    return(this._chromFitness);
  }
  
  set chromFitness(cf){
    this._chromFitness = cf;
  }
  
  // Update the chromossomes fitness score based on an internal function - Note that function should only generate positive results, and reward higher fitness.
  updateFitness(){
    let newFit = 0;
    
    // Rewards on amount of 1's found in genes - should generate 1111...
    if(this.chromType == "binary"){
      
      for(let i = 0; i < this.chromSize; i++){
        if(i==0 && this.chromGenes[i] == 1) newFit++;
        else if(this.chromGenes[i] == 0 && i>0) newFit++;
      }
    }
    else if(this.chromType == "real"){
    
    }
    else if(this.chromType == "discrete"){
    
    }
    
    this.chromFitness = newFit;
  }
  
  // Activates mutation - assumes roll has already happened
  mutate(){
    if(this.chromType == "binary"){
      // Random bitflip
      let pos = int(random(0,this.chromSize));
      this.chromGenes[pos] = abs(this.chromGenes[pos]-1);
    }
  }
}