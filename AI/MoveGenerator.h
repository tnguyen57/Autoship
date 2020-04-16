#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <cassert>
#include "mtrand.h"
#include "Board.h"
#include <time.h>


#ifndef __MoveGenerator_H
#define __MoveGenerator_H

class MoveGenerator
{
public:
	MoveGenerator(unsigned int time, unsigned int genType, Board* board);
	~MoveGenerator() { clear(); }

	void findNextMove(unsigned int &i, unsigned int &j); // This will return a coordinate of the next location to attack based on the suggestion of the specific move generator
	void Win() const { std::cout << "I reign victorious.\n" << *b << std::endl; } // Prints a win message for debugging purposes

	bool solved() const { return b->gameOver(); } // Returns true if all ships are sunk and false otherwise
	
private:
	void clear(); // Deallocates any memory on the heap.
	void randomGenerator(unsigned int &x, unsigned int &y); // Generates a move randomly using the MT random generator
	void deterministicGenerator(unsigned int &x, unsigned int &y); // Generates a move based on a PDF of all possible ship locations (calculated within a certain time tolerance)
	void generatePossibleShipLocations(unsigned long long& **shipsOnTile_, unsigned int i, unsigned int j,
			unsigned int **boardRepresentation_, const Board& b, unsigned int shipNumber, bool hitShip); // Recursive method for generating all possible ship locations

	Board* b; // Board Object
	bool** visited; // Stored a map of locations visited; true means it has been attacked, false is unrevealed
	unsigned int t; // Time per move calulation in seconds
	unsigned int generatorType; // 1 is the random generator, 2 is the deterministic generator, 3 is the learning AI
	std::vector<std::vector<unsigned int> > possibleLocations; // A map for possible locations for the random generator to attack
};

#endif