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
	~MoveGenerator();

	void findNextMove(unsigned int &i, unsigned int &j);
	void Win() const;

	bool solved() const { return b->gameOver(); }
	
private:
	void clear();
	void randomGenerator(unsigned int &x, unsigned int &y);
	void deterministicGenerator(unsigned int &x, unsigned int &y);

	Board* b; // Board Object
	bool** visited;
	unsigned int t; // Time per move calulation in seconds
	unsigned int generatorType;
	std::vector<std::vector<unsigned int> > possibleLocations;
};

#endif