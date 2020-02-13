class Player{
  constructor(defaultPos,playerSize,playerObj){
    this.pos = createVector(defaultPos.x,defaultPos.y);
    this.size = playerSize;             // Expect to be 4-20
    this.vel = createVector(PLAYER_VELOCITY, PLAYER_VELOCITY);       // Expect to be 1-10
    this.extForce = createVector(0,0);  // External force velocity
    this.state = "alive";               // "alive";"dead";"won"
    this.objectivePos = playerObj;
    this.numberMoves = 0;
    this.usefulMoves = createVector(0,0);
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

  
  
  // moveX - Defines direction of horizontal movement, used as multiplier: -1 Left; 0 Stay; 1 Right
  // moveY - Defines direction of vertical movement, used as multiplier: -1 Down; 0 Stay; 1 Up
  updatePos(move){
    if (this.state == "alive"){
      let moveX,moveY;
      if(move == 0 || move == 3 || move == 6) moveX = -1;
      if(move == 1 || move == 4 || move == 7) moveX = 0;
      if(move == 2 || move == 5 || move == 8) moveX = 1;
      if(move == 0 || move == 1 || move == 2) moveY = -1;
      if(move == 3 || move == 4 || move == 5) moveY = 0;
      if(move == 6 || move == 7 || move == 8) moveY = 1;

	    let nextPosX = this.pos.x + (this.vel.x * moveX) + this.extForce.x;
	    let nextPosY = this.pos.y + (this.vel.y * moveY) + this.extForce.y; 

	    let collisionTest = 0; 

	    for(let i = 0; i < OBSTACLES.length && !collisionTest; i++){
		    let nextPos = createVector(nextPosX,nextPosY)
		   	collisionTest = checkCollideRects(OBSTACLES[i].pos,OBSTACLES[i].size,nextPos,this.size);
		}

	    if(	nextPosX >= 0 && nextPosX + this.size.x < MAP_BORDER && nextPosY >= 0 && nextPosY + this.size.y < height && !collisionTest){
	      	this.pos.x = nextPosX;
	      	this.pos.y = nextPosY;
		    
	        let test = checkCollideRects(this.pos,this.size,this.objectivePos,this.size);
		    // checking if player collided with objective
	        if(test){
	        	this.state = "won";
	        }

	        if(moveX == 1){
	        	this.usefulMoves.x++;
	        }
	        else if(moveX == -1){
	            this.usefulMoves.x = this.usefulMoves.x - 1;
	        }

	        if(moveY == 1){
	            this.usefulMoves.y++;
	        }
	        else if(moveY == -1){
	            this.usefulMoves.y = this.usefulMoves.y - 1;
	        }
	    }
	    // else collision x and y(dead) - updatePos should stop doing anything
	    else{
	      this.state ="dead";
	    }

      this.numberMoves++;
	}

    this.draw();
  }
  
}