/*  Project name: Genetic Algorithm Visualization
  Project author: Gustavo Fardin Monti.
  The P5.JS library was used. Visit the website to know more: https://p5js.org/
  Feel free to contact me at gustavo_m@hotmail.co.uk */
  // This class is used to represent a player in the map. Each player has a corresponding chromossome that represents him.
class Player{
  // pos: Vector containing x and y position of the player. Initialiy set to defaultPos. 
  // size: Size of the rect that represents the player.
  // vel: Vector containing how many pixels a player may move per turn.
  // extForce: Vector that could be used to represent external influence. Actually velocity.
  // state: Represents the condition of the of the player in the current generation. Either "alive", "dead" (touched obstacle or map limits) or "won" (reached objective).
  // objectivePos: Vector containing the x and y position the player must reach.
  // numberMoves: Moves done by the player in the current generation. Everytime this reaches the limit, player can't move anymore and is classified as dead.
  
  constructor(defaultPos,playerSize,playerObj){
    this.pos = createVector(defaultPos.x,defaultPos.y);         // Marks the (x,y) position of the player
    this.size = playerSize;                                     // Between [4,20] should be good enough
    this.vel = createVector(PLAYER_VELOCITY, PLAYER_VELOCITY);  // As a rule of thumb, make smaller than the minimum obstacle size.
    this.extForce = createVector(0,0);                          // External force velocity - may be used to add gravity or a pull/push.
    this.state = "alive";                                       // "alive";"dead";"won"
    this.objectivePos = playerObj;                              // Marks where the player's objective is
    this.numberMoves = 0;                                       // Moves made by the player
  }
  
  get pos(){
    return (this._pos);
  }
  
  set pos(p){
    this._pos = p;
  }

  draw(){
  	stroke(100);
  	if(this.state == "alive") fill(0,255,0);
  	else if(this.state == "dead") fill(255,0,0);
  	else if(this.state == "won") fill(200,0,200);
    
    rect(this.pos.x,this.pos.y,this.size.x,this.size.y);
  }

  updatePos(move){
    // If the player is still alive, try to move him. May cause death.
    if (this.state == "alive"){
      // moveX - Defines direction of horizontal movement, used as multiplier: -1 Left; 0 Stay; 1 Right
      // moveY - Defines direction of vertical movement, used as multiplier: -1 Down; 0 Stay; 1 Up
      let moveX,moveY;
      // Decodes the move passed from the gene to an actual x and y move
      if(move == 0 || move == 3 || move == 6) moveX = -1;
      if(move == 1 || move == 4 || move == 7) moveX = 0;
      if(move == 2 || move == 5 || move == 8) moveX = 1;
      if(move == 0 || move == 1 || move == 2) moveY = -1;
      if(move == 3 || move == 4 || move == 5) moveY = 0;
      if(move == 6 || move == 7 || move == 8) moveY = 1;

      // Calculate the next position caused by movement
	    let nextPosX = this.pos.x + (this.vel.x * moveX) + this.extForce.x;
	    let nextPosY = this.pos.y + (this.vel.y * moveY) + this.extForce.y; 

      // Check if colission happens while moving to next position
	    let collisionTest = 0; 

      // Verify collision with each obstacle
	    for(let i = 0; i < OBSTACLES.length && !collisionTest; i++){
		    let nextPos = createVector(nextPosX,nextPosY)
		   	collisionTest = checkCollideRects(OBSTACLES[i].pos,OBSTACLES[i].size,nextPos,this.size);
		  }

      // If it didn't collide with obstacles, verify if it's within map limits.
	    if(	nextPosX >= 0 && nextPosX + this.size.x < MAP_BORDER && nextPosY >= 0 && nextPosY + this.size.y < height && !collisionTest){
	      	this.pos.x = nextPosX;
	      	this.pos.y = nextPosY;
		      
          // Also verify if it has reached the object
	        let test = checkCollideRects(this.pos,this.size,this.objectivePos,this.size);
	        if(test){
	        	this.state = "won";
	        }
        }
	    // A collision happened. Updates state to dead.
	    else{
	      this.state ="dead";
	    }

      // Update number of moves done.
      this.numberMoves++;
    }
    // Always draw player, even if dead.
    this.draw();
  }
  
}