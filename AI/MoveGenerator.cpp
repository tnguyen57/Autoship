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
		std::vector<unsigned int> temp;
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			visited[i][j] = false;
			temp.push_back(j);
		}
		possibleLocations.push_back(temp);
	}
}

void MoveGenerator::clear()
{
	for (unsigned int i = 0; i < b->getWidth(); i++)
		delete [] visited[i];
	delete [] visited;
}

void MoveGenerator::findNextMove(unsigned int &i, unsigned int &j)
{
	switch(generatorType)
	{
		case 1: randomGenerator(i, j); return;
		case 2: deterministicGenerator(i, j); return;
	}
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
		/*bool hit = */b->attackSpace(i, k, sunk);
		visited[i][k] = true;
	}
	x = i;
	y = k;
}

void MoveGenerator::deterministicGenerator(unsigned int &x, unsigned int &y)
{
	if (!b->getTurn())
	{
		static MTRand mtrand;
		x = b->getWidth()/2 - mtrand.randInt(1);
		y = b->getHeight()/2 - mtrand.randInt(1);
	}
	unsigned long long **shipsOnTile = new unsigned long long*[b->getHeight()];

	/*
		Various integers represent different meanings of what is on the board.
		0   - unrevealed tile             (0 ships on the tile)
		110 - revealed but a miss         (comes from a recruiting code. When crossing out 110, the 11 looks like N and the 0 is like O so it becomes NO for no ship)
		10  - revealed, hit, and sunk     (9 + 1 is 10; no special meanings for this one)
		9   - revealed, hit, but not sunk (comes from nein meaning no in German and having the same pronunciation)
	*/
	unsigned int **boardRepresentation = new unsigned int*[b->getHeight()];
	bool unsunk = false;
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		shipsOnTile[i] = new unsigned long long[b->getWidth()];
		boardRepresentation[i] = new unsigned int[b->getWidth()];
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			shipsOnTile[i][j] = 0;
			if (b->checkSpace(i, j))
			{
				if (b->checkHit(i, j))
				{
					if (b->sunkSpace(i, j))
						boardRepresentation[i][j] = 10;
					else
					{
						boardRepresentation[i][j] = 9;
						unsunk = true;
					}
				}
				else
					boardRepresentation[i][j] = 110;
			}
			else
				boardRepresentation[i][j] = 0;
		}
	}
	unsigned int s = 0;
	for (unsigned int i = 0; i < b->getNumShips(); i++)
	{
		if (unsunk)
		{
			if (b->getShipHealth(i) != b->getShipSize(i))
			{
				s = i;
				break;
			}
		}
		else if (b->getShipHealth(i) == b->getShipSize(i))
		{
			s = i;
			break;
		}
	}
	generatePossibleShipLocations(shipsOnTile, x, y, boardRepresentation, *b, s, unsunk);
}

void MoveGenerator::generatePossibleShipLocations(unsigned long long** &shipsOnTile_, unsigned int i, unsigned int j,
			unsigned int **boardRepresentation_, const Board& b, unsigned int shipNumber, bool hitShip)
{

}