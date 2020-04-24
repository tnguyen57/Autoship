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

/*
	The random generator was tested with 15,800,561 simulations. The average turns per game
	was 93. It completed 331.5 games per second and ran for 13h:14m:21.897s.
*/
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
		possibleLocations[x].erase(possibleLocations[x].begin()+y);
		if (!b->checkSpace(x, y))
		{
			bool sunk = false;
			/*bool hit = */b->attackSpace(x, y, sunk);
			visited[x][y] = true;
		}
		return;
	}
	x = y = 0;
	std::vector<std::vector<unsigned long long> > shipsOnTile;

	/*
		Various integers represent different meanings of what is on the board.
		0   - unrevealed tile             (0 ships on the tile)
		110 - revealed but a miss         (comes from a recruiting code. When crossing out 110, the 11 looks like N and the 0 is like O so it becomes NO for no ship)
		10  - revealed, hit, and sunk     (9 + 1 is 10; no special meanings for this one)
		9   - revealed, hit, but not sunk (comes from nein meaning no in German and having the same pronunciation)
	*/
	unsigned int **boardRepresentation = new unsigned int*[b->getHeight()];
	bool unsunk = false;
	unsigned int numHit = 0;
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		std::vector<unsigned long long> temp;
		boardRepresentation[i] = new unsigned int[b->getWidth()];
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			temp.push_back(0);
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
						numHit++;
					}
				}
				else
					boardRepresentation[i][j] = 110;
			}
			else
				boardRepresentation[i][j] = 0;
		}
		shipsOnTile.push_back(temp);
	}
	if (unsunk)
	{
		generatePossibleHitLocations(shipsOnTile, x, y, boardRepresentation, unsunk, numHit);
		unsigned int max = 0;
		for (unsigned int i = 0; i < b->getHeight(); i++)
		{
			for (unsigned int j = 0; j < b->getWidth(); j++)
			{
				if (shipsOnTile[i][j] > max)
				{
					x = i;
					y = j;
					max = shipsOnTile[i][j];
					// std::cout << "Max achieved on tile " << x << " " << y << ": " << max << std::endl;
				}
			}
		}
		if (!b->checkSpace(x, y))
		{
			bool sunk = false;
			/*bool hit = */b->attackSpace(x, y, sunk);
			visited[x][y] = true;
			for (unsigned int i = 0; i < possibleLocations[x].size(); i++)
			{
				if (possibleLocations[x][i] == y)
					possibleLocations[x].erase(possibleLocations[x].begin()+i);
			}
		}
	}
	else
	{
		randomGenerator(x,y);
	}
	for (unsigned int i = 0; i < b->getHeight(); i++)
		delete [] boardRepresentation[i];
	delete [] boardRepresentation;
}

void MoveGenerator::generatePossibleHitLocations(std::vector<std::vector<unsigned long long> >& shipsOnTile_, unsigned int i, unsigned int j,
			unsigned int **boardRepresentation_, bool hit, unsigned int numHit_)
{
	// If a ship is hit, the calculator will only calculate probabilities for the surrounding tiles until that ship is sunk.
	if (hit)
	{
		for (unsigned int _ = 0; _ < numHit_; _++) // Runs until there are no hit tiles remaining
		{
			while (boardRepresentation_[i][j] != 9) // Finds the next hit tile (top to bottom, left to right)
			{
				if (j < b->getWidth() - 1)
					j++;
				else if (i < b->getHeight()-1)
				{
					j = 0;
					i++;
				}
				else
				{
					std::cout << "SOMETHING'S WRONG HERE!!!!" << std::endl;
					return; // Prevents the loop from testing indices out of bounds. The code should never reach here.
				}
			}
			for (unsigned int ship = 0; ship < b->getNumShips(); ship++)
			{
				if (b->getShipHealth(ship) == 0) continue;

				unsigned int l = b->getShipSize(ship);

				bool up = i != 0 && boardRepresentation_[i-1][j] != 110 && boardRepresentation_[i-1][j] != 10;
				bool down = i < b->getHeight()-1 && boardRepresentation_[i+1][j] != 110 && boardRepresentation_[i+1][j] != 10;
				bool left = j != 0 && boardRepresentation_[i][j-1] != 110 && boardRepresentation_[i][j-1] != 10;
				bool right = j < b->getWidth() - 1 && boardRepresentation_[i][j+1] != 110 && boardRepresentation_[i][j+1] != 10;

				unsigned int positive_d = 0;
				unsigned int negative_u = 0;
				unsigned int positive_r = 0;
				unsigned int negative_l = 0;

				for (unsigned int k = 1; k < l && (up || down || left || right); k++) // Counts all directions in one loop for a minor optimization
				{
					if (up) // Continues counting until it can no longer go up one tile
					{
						up = i-k != 0 && boardRepresentation_[i-k-1][j] != 110 && boardRepresentation_[i-k-1][j] != 10;
						negative_u++;
					}
					if (down) // Continues counting until it can no longer go down one tile
					{
						down = i+k < b->getHeight() - 1 && boardRepresentation_[i+k+1][j] != 110 && boardRepresentation_[i+k+1][j] != 10;
						positive_d++;
					}
					if (left) // Continues counting until it can no longer go left one tile
					{
						left = j-k != 0 && boardRepresentation_[i][j-k-1] != 110 && boardRepresentation_[i][j-k-1] != 10;
						negative_l++;
					}
					if (right) // Continues counting until it can no longer go right one tile
					{
						right = j+k < b->getWidth() - 1 && boardRepresentation_[i][j+k+1] != 110 && boardRepresentation_[i][j+k+1] != 10;
						positive_r++;
					}
				}
				if (positive_d + negative_u + 1 >= l)
				{
					for (unsigned int k = i-negative_u; k <= i+positive_d; k++)
					{
						if (boardRepresentation_[k][j] == 9) continue; // Avoid counting already hit tiles

						if (k < i)
							shipsOnTile_[k][j] += negative_u - (i-k) + 1; // Number of possible ship configurations on this tile if above the hit tile
						else
							shipsOnTile_[k][j] += positive_d - (k-i) + 1; // Number of possible ship configurations on this tile if below the hit tile
					}
				}
				if (positive_r + negative_l + 1 >= l)
				{
					for (unsigned int k = j-negative_l; k <= j+positive_r; k++)
					{
						if (boardRepresentation_[i][k] == 9) continue; // Avoid counting already hit tiles

						if (k < j)
							shipsOnTile_[i][k] += negative_l - (j-k) + 1; // Number of possible ship configurations on this tile if above the hit tile
						else
							shipsOnTile_[i][k] += positive_r - (k-j) + 1; // Number of possible ship configurations on this tile if below the hit tile
					}
				}
			}
			if (j < b->getWidth() - 1)
				j++;
			else if (i < b->getHeight()-1)
			{
				j = 0;
				i++;
			}
			else break;
		}
	}
	

	// unsigned long long simulations = 0;
	// if (b.getShipSize(shipNumber) - b.getShipHealth(shipNumber) > 1)
	// {
	// 	bool up, down, left, right;
	// 	up = i != 0 && boardRepresentation_[i-1][j] != 110 && boardRepresentation_[i-1][j] != 10;
	// 	down = i+1 < b.getHeight()-1 && boardRepresentation_[i+1][j] != 110 && boardRepresentation_[i+1][j] != 10;
	// 	left = j != 0 && boardRepresentation_[i][j-1] != 110 && boardRepresentation_[i][j-1] != 10;
	// 	right = j + 1 < b.getWidth() - 1 && boardRepresentation_[i][j+1] != 110 && boardRepresentation_[i][j+1] != 10;

	// 	if (up || down)
	// 	{
	// 		unsigned int up_free = 0;
	// 		unsigned int down_free = 0;
	// 		if (up)
	// 		{
	// 			for (unsigned int k = 1; k <= b.getShipHealth(shipNumber); k++)
	// 			{
	// 				if (k > i || boardRepresentation_[i-k][j] == 110 || boardRepresentation_[i-k][j] == 10) break;
	// 				up_free++;
	// 			}
	// 		}
	// 		if (down)
	// 		{
	// 			for (unsigned int k = 1; k <= b.getShipSize(shipNumber); k++)
	// 			{
	// 				if (i+k >= b.getHeight() || boardRepresentation_[i+k][j] == 110 || boardRepresentation_[i+k][j] == 10) break;
	// 				if (boardRepresentation_[i+k][j] == 0) down_free++;
	// 			}
	// 		}
	// 		if (up && up_free == b.getShipHealth(shipNumber))
	// 		{
	// 			for (unsigned int k = 1; k <= up_free; k++)
	// 				shipsOnTile_[i-k][j]++;
	// 		}
	// 		if (down && down_free == b.getShipHealth(shipNumber))
	// 		{
	// 			while (downfree > 0)
	// 			{
	// 				if (boardRepresentation_[i+k][j] != 9)
	// 				{
	// 					shipsOnTile_[i+k][j]++;
	// 					downfree--;
	// 				}
	// 			}
	// 		}
	// 	}
	// }
}