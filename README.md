# Map navigation with Genetic Algorithm
This is my first project using JavaScript. For an easier learning curve, the *P5.JS* library was used. Thus, this project involved applying theoretical knowledge in the fields of: "Artificial Intelligence" and "Object-oriented Programming".

## Table of contents
1. [Problem description](#problemDescription)
2. [Basic use](#basicUse)
3. [Applying the GA to the task](#application)
4. [Genetic Algorithm Implementation](#geneticAlgorithm)
	1. [Fitness and Diversity](#fitness)
	2. [Selection Methods](#selection)
	3. [Crossover Methods](#crossover)
	4. [Mutation](#mutation)
5. [Limitations](#limitations)

## Problem description <a name = "problemDescription"></a>
The environment has a very simple task to be accomplished. The player begins at a spawn position in an "alive" state (colour green), and must reach the objective position (goal/the yellow square). For each frame, the player must choose one of eight movements (Move North, North-east, East, etc...) where each type of movement is associated with a number. Only players that are "alive" may move, the others, will stay frozen.

The simulation environment reads the movement for the frame, and moves the player in the determined direction. If the player collides with the walls of the simulation, or an object (which may be drawn/delete by the user of the simulation), he is marked as "dead" (colour red) until the end of the current generation. If the player navigates through the map and reaches the objective, he will be marked as "won" (colour purple).

Each player is limited by a finite number of steps which he may take. When the steps finish, the current generation of the game ends, and the game starts again with the player at the spawn point.

## Basic use <a name = "basicUse"></a>
Here I will explain how to use the files and the GUI once it's done.

## Genetic Algorithm Implementation <a name = "geneticAlgorithm"></a>
Here I will give a basic review of the Genetic Algorithm and explain how it was implemented.

### Fitness and diversity <a name = "fitness"></a>
The fitness function is used to determine a score for each chromosome. In our implementation, the `updateFitness()` method of the `chromosome` class calculates this score for a particular chromosome. The calculation is done by associating the chromosome to a player, by an *id* that is passed as a parameter. The correspondant player object is stored in a variable, so its attributes may easily be acessed(such as position) and the final position of the player when he runs out of moves can be given a score.

The calculation of the fitness begins by calculating the euclidean distance between the middle of the players final position, and the middle of the objective position. Because the map is proportionate to the size of the window, we calculated the maximum distance can be the euclidean distance from (0,0) to (800,600) which is 1000. So, *fit = 1000 - eucDist* generates a value between 0 and 1000, and may be normalized being divided by 1000. We then take the square root of the normalized fitness value, and so the closer to the objective, while the fitness grows, it grows slower. 

One of the problems with using the distance to the objective was due local maximums. If a wall was placed between the players an the objective, they would generally not go around the wall. In order to force *diversity* between the chromosomes, the average position of the population was calculated at the end of every frame. This allowed to calculate the manhattan distance between the player and the average center of the population (marked by the red circle), and increment the *fit* score in a way that rewarded players that where farther from the center. This increment is controlled by `DIVERSITY_WEIGHT`, `DIVERSITY_DROPOFF` and `CURRENT_DIVERSITY`. 

The diversity weight is the maximum diversity value, the bigger it is, the LESS diverse the population becomes. The current diversity is initially the diversity weight, however, as more players reach the objective, you've reached a valid solution and (probably) want for these players to optimize this solution. This is done by increcrementing the current diversity by `DIVERSITY_DROPOFF * CURRENT_DIVERSITY`. 

Simple problems, where the euclidean distance can somewhat safely guide the population may have large diversity weight, however, for problems with sharp turns, where the objective is behind the wall, generally lowering the diversity to about 10-15 helps.

### Selection Methods <a name = "selection"></a>
The definitions of the selection methods used where borrowed from [here](https://www.semanticscholar.org/paper/Comparison-of-Selection-Methods-and-Crossover-using-Alabsi-Naoum/365f10cdaa9603a007f56356b3fb51d7111989f6) and [here](https://www.idjsr.com/uploads/68/3180_pdf.pdf). Here is a basic overview of each selection method used:
* `"roulette"`: The attribute `chromTotal` stores the sum of all fitness values for the generation. A random number is generated between (0,`chromTotal`) and a loop is used to accumulate the fitness values of the population. An index value is incremented for each iteration. Once the accumulated value is larger than the random number, the loop stops and the index contains the first parent chromosome. Another random number is generated and the process is repeated to find the second parent. 
* `"rank"`: Also known as stochastic. The population is ordered by fitness (done when the fitness is updated). The last chromosome is given rank 1, the second-last rank 2, and so on, until the first position is given rank `popSize`. The sum of these ranks can be calculated by the [arithmetic series](http://mathworld.wolfram.com/ArithmeticSeries.html) and stored in `rankSum`. A random number is generated in the interval (0,`rankSum`) and a loop is used to accumulate the sum of ranks. If the accumulated value is larger than the random number, the loop stops, the index contains the index of the first parent chromosome. The process is repeated with a new random number for second parent. 

### Crossover Methods <a name = "crossover"></a>

### Mutation <a name = "mutation"></a>

## Applying the GA to the task <a name = "application"></a>
In order to solve the task, the `PlayerControl` class was used to generate an array of `Player`'s and control the parameters of the players, such as spawn positions, objective positions, size, etc. Each `Player` has a position, velocity, state and other auxiliary variables. For each *generation*, the `move()` method of the `PlayerControl` is called a fixed amount of times. This method is used to track and control the execution of the current generation. Once the generation completes a pre-determined number of moves, the population fitness is calculated and the next generation is created using the genetic algorithm.

The population for the `GeneticAlgorithm` class is composed of chromosomes, which are used to represent players (one player = one chromosome), where each chromosome is composed of genes. The chromosome has a `max_moves` number of genes, so each gene represents a move. Each chromosome and its sequence of genes describes how a player will move. The fitness for that player is only calculated once he has made all his moves.

The application of a genetic algorithm to solve this problem implies that the sequence of moves for the populations is selected towards maximizing the fitness function, and so, the fitness function must be written to reward players that get closer to the objective without colliding with obstacles. If the fitness function can accomplish this, by each generation, the genetic algorithm will get better and better at guiding the players through the current map. 

## Limitations <a name = "limitations"></a>
* When too many players die off, if their fitness is too low, what may happen is that the entire population becomes a copy of a small number of chromosomes.

# Change log:
- Updated the readme
- Added comments for the constructor variables. 
- Removed the audio-library file (don't know why I had it).
- Tiddied up the code
- Implemented rank based cross over selection.
- Implemented Diversity [Here](https://youtu.be/kHyNqSnzP8Y?t=1678)
- Implement the buttons for:
	* CrossOver type selection
	* Selection type selection, 
	* Crossover %
	* Mutation % 
	* Toggle Population average position 
