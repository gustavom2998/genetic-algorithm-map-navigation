/*  Project name: Genetic Algorithm Visualization
  Project author: Gustavo Fardin Monti.
  The P5.JS library was used. Visit the website to know more: https://p5js.org/
  Feel free to contact me at gustavo_m@hotmail.co.uk */

// Used mainly to collect obstacles. Collision detection, creating, deletion, and actual collection is done mainly by the main and guiObject class.
class Obstacle{
  // Pos: Vector containing the X and Y  position of the obstacle in the map.
  // Size: Vector containing the X and Y size of the obstacle in the map.
  
  constructor(Pos,Size){
    this.pos = createVector(Pos.x,Pos.y);
    this.size = createVector(Size.x,Size.y);
  }
  
  draw(){
    fill(50,50,70);
    stroke(100);
    rect(this.pos.x,this.pos.y,this.size.x,this.size.y);
  }

  // Ended up implementing this in main and in the player object.
  checkColission(xCord,yCord){
  	
  }
}