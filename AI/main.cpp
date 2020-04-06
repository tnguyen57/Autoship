#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include "mtrand.h"
#include "Board.h"

Board loadBoard(std::ifstream& in)
{
	
}

/*
Takes an input file of board data and an output file for move guesses.
*/
int main(int argc, char** argv)
{
	if(argc != 2)
	{
		std::cerr << "Proper usage is: " << argv[0] << " input_file.txt output_file.txt" << std::endl;
		return -1;
	}

	std::ifstream boardInput(argv[1]);
	if(!boardInput){
		std::cerr << "Couldn't open " << argv[1] << " for reading." << std::endl;
		return -1;
	}

	std::ofstream moveOutput(argv[2]);
	if(!moveOutput){
		std::cerr << "Couldn't open " << argv[2] << " for writing." << std::endl;
		return -1;
	}


	return 0;
}