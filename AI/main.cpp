#include <iostream>
#include <string>
#include <fstream>
#include <cassert>
#include "mtrand.h"
#include "Board.h"
#include <time.h>
#include "MoveGenerator.h"

/*
Initializes the Board object from the input file.
*/
Board loadBoard(std::ifstream& in)
{
	unsigned int height, width, numShips, shipLength;
	std::string terminate;

	in >> height >> width >> numShips;
	Ship** ships = new Ship*[numShips];
	Board b(height, width, numShips, ships);
	
	for (unsigned int i = 0; i < numShips; i++)
	{
		in >> shipLength;
		unsigned int x[shipLength];
		unsigned int y[shipLength];
		Ship* s = new Ship(shipLength, "temp");
		for (unsigned int j = 0; j < shipLength; j++)
		{
			in >> x[j] >> y[j];
		}
		b.addShip(x, y, s, shipLength, i);
	}
	in >> terminate;
	assert(terminate == "end");
	return b;
}

/*
Takes an input file of board data and an output file for move guesses.
*/
int main(int argc, char** argv)
{
	if(argc != 6)
	{
		std::cerr << "Proper usage is: " << argv[0] << " input_file.txt output_file.txt generator_type(1=random, 2=deterministic, 3=machine_learning) time_per_calculation debugging_toggle(true=output_on, false=output_off)." << std::endl;
		return -1;
	}

	std::ifstream boardInput(argv[1]);
	if(!boardInput){
		std::cerr << "Couldn't open " << argv[1] << " for reading." << std::endl;
		return -1;
	}

	Board b = loadBoard(boardInput);

	bool debuggingOutput = false;
	std::string out_put = argv[5];
	if (out_put == "true")
		debuggingOutput = true;

	if (debuggingOutput)
		std::cout << b << std::endl;

	std::ofstream moveOutput(argv[2]);
	if(!moveOutput){
		std::cerr << "Couldn't open " << argv[2] << " for writing." << std::endl;
		return -1;
	}

	unsigned int generatorType = atoi(argv[3]);
	unsigned int timePerCalculation = atoi(argv[4]);

	MoveGenerator g(timePerCalculation, generatorType, &b);

	while (!g.solved())
	{
		unsigned int i, j;
		g.findNextMove(i, j);
		moveOutput << i << " " << j << std::endl;
	}
	g.Win();

	return 0;
}