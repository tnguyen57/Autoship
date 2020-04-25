#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include "mtrand.h"
#include "Board.h"
#include <time.h>


#ifndef __MoveGenerator_H
#define __MoveGenerator_H

int kbhit(); //Allows the use of kbhit() for Linux Systems.

class MoveGenerator
{
public:
	MoveGenerator(unsigned int time, unsigned int genType, Board* board);
	~MoveGenerator() { clear(); }

	void findNextMove(unsigned int &i, unsigned int &j); // This will return a coordinate of the next location to attack based on the suggestion of the specific move generator
	void Win(); // Increments the AI info on previous ship locations with the current games information

	bool solved() const { return b->gameOver(); } // Returns true if all ships are sunk and false otherwise
	
private:
	void clear(); // Deallocates any memory on the heap.
	void attack(unsigned int x, unsigned int y); // Attacks space and updates helper variables as needed
	bool update(unsigned int &x, unsigned int &y); // Updates boardRepresentation, hit, and shipsOnTile
	void randomGenerator(unsigned int &x, unsigned int &y); // Generates a move randomly using the MT random generator
	void deterministicGenerator(unsigned int &x, unsigned int &y); // Generates a move based on a PDF of all possible ship locations (calculated within a certain time tolerance)
	void playerAIGenerator(unsigned int &x, unsigned int &y); // Generates a move based on previous ship placements in other games.
	void generatePossibleHitLocations(unsigned int i, unsigned int j); // Calculates most likely spot for a hit

	Board* b; // Board Object
	bool** visited; // Stored a map of locations visited; true means it has been attacked, false is unrevealed
	unsigned int t; // Time per move calulation in seconds
	unsigned int generatorType; // 1 is the random generator, 2 is the deterministic generator, 3 is the learning AI
	std::vector<std::vector<unsigned int> > possibleLocations; // A map for possible locations for the random generator to attack
	unsigned int **boardRepresentation;
	std::vector<std::vector<unsigned long long> > shipsOnTile;
	unsigned int hit; // Number of tiles on the board that have a hit ship that hasn't yet sunk.
	bool skew; // This is the skew used to reduce the maximum number of turns the computer uses.
};

#endif