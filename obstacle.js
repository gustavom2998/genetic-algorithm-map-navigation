class Obstacle{
  
  constructor(Pos,Size){
    this.pos = createVector(Pos.x,Pos.y);
    this.size = createVector(Size.x,Size.y);
  }
  
  draw(){
    fill(50,50,70);
    stroke(100);
    rect(this.pos.x,this.pos.y,this.size.x,this.size.y);
  }

  checkColission(xCord,yCord){
  	
  }
}