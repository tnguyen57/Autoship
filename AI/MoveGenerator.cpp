#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <cassert>
#include "mtrand.h"
#include "Board.h"
#include <time.h>
#include "MoveGenerator.h"

MoveGenerator::MoveGenerator(unsigned int time, unsigned int genType, Board* board)
{
	b = board;
	t = time;
	generatorType = genType;

	visited = new bool*[b->getHeight()];
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		visited[i] = new bool[b->getWidth()];
		for (unsigned int j = 0; j < b->getWidth(); j++)
			visited[i][j] = false;
	}

	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		std::vector<unsigned int> temp;
		for (unsigned int j = 0; j < b->getWidth(); j++)
			temp.push_back(j);
		possibleLocations.push_back(temp);
	}
}

MoveGenerator::~MoveGenerator()
{
	clear();
}

void MoveGenerator::clear()
{
	for (unsigned int i = 0; i < b->getWidth(); i++) {
		delete [] visited[i];
	}
	delete [] visited;
}

void MoveGenerator::findNextMove(unsigned int &i, unsigned int &j)
{
	switch(generatorType)
	{
		case 1: randomGenerator(i, j); break;
	}
}

void MoveGenerator::Win()
{
	std::cout << "I reign victorious.\n" << *b << std::endl;
}

void MoveGenerator::randomGenerator(unsigned int &x, unsigned int &y)
{
	static MTRand mtrand;
	unsigned int i, j;
	unsigned int k;

	i = mtrand.randInt(possibleLocations.size() - 1);
	while (possibleLocations[i].size() == 0)
		i = mtrand.randInt(possibleLocations.size() - 1);
	j = mtrand.randInt(possibleLocations[i].size() - 1);

	k = possibleLocations[i][j];
	possibleLocations[i].erase(possibleLocations[i].begin()+j);

	if (!b->checkSpace(i, k))
	{
		bool sunk = false;
		bool hit = b->attackSpace(i, k, sunk);
		visited[i][k] = true;
	}
	x = i;
	y = k;
}