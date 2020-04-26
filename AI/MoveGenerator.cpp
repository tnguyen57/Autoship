#include "MoveGenerator.h"

MoveGenerator::MoveGenerator(unsigned int time, unsigned int genType, Board* board)
{
	b = board;
	t = time;
	generatorType = genType;
	hit = 0;
	static MTRand mtrand;
	skew = mtrand.randInt(1);
	/*
		For boardRepresentation:

		Various integers represent different meanings of what is on the board.
		0   - unrevealed tile             (0 ships on the tile)
		110 - revealed but a miss         (comes from a recruiting code. When crossing out 110, the 11 looks like N and the 0 is like O so it becomes NO for no ship)
		10  - revealed, hit, and sunk     (9 + 1 is 10; no special meanings for this one)
		9   - revealed, hit, but not sunk (comes from nein meaning no in German and having the same pronunciation)
	*/
	boardRepresentation = new unsigned int*[b->getHeight()];
	visited = new bool*[b->getHeight()];
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		std::vector<unsigned long long> tmp;
		visited[i] = new bool[b->getWidth()];
		boardRepresentation[i] = new unsigned int[b->getWidth()];
		std::vector<unsigned int> temp;
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			tmp.push_back(0);
			boardRepresentation[i][j] = 0;
			visited[i][j] = false;
			if (generatorType == 1 || (skew && (i+j) % 2 == 0) || (!skew && (i+j) % 2 == 1))
				temp.push_back(j);
		}
		shipsOnTile.push_back(tmp);
		possibleLocations.push_back(temp);
	}
}

void MoveGenerator::Win()
{
	if (generatorType != 3) return;
	unsigned int x = 0, y = 0;
	update(x, y);
	std::ifstream boardInput("Previous_Game_Data.txt");
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			unsigned long long tmp;
			boardInput >> tmp;
			if (boardRepresentation[i][j] == 9 || boardRepresentation[i][j] == 10)
				tmp++;
			shipsOnTile[i][j] = tmp;
		}
	}
	boardInput.close();

	std::ofstream boardOutput("Previous_Game_Data.txt");
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			boardOutput << shipsOnTile[i][j];
			if (j < b->getWidth() - 1)
				boardOutput << " ";
		}
		boardOutput << std::endl;
	}
	boardOutput.close();
}

void MoveGenerator::clear()
{
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		delete [] visited[i];
		delete [] boardRepresentation[i];
	}
	delete [] visited;
	delete [] boardRepresentation;
}

void MoveGenerator::attack(unsigned int x, unsigned int y)
{
	if (!b->checkSpace(x, y))
	{
		bool sunk = false;
		b->attackSpace(x, y, sunk);
		if (sunk)
			boardRepresentation[x][y] = 10;
		visited[x][y] = true;
		for (unsigned int i = 0; i < possibleLocations[x].size(); i++)
		{
			if (possibleLocations[x][i] == y)
				possibleLocations[x].erase(possibleLocations[x].begin()+i);
		}
	}
}

bool MoveGenerator::update(unsigned int &x, unsigned int &y)
{
	hit = 0;
	for (unsigned int i = 0; i < b->getHeight(); i++)
	{
		for (unsigned int j = 0; j < b->getWidth(); j++)
		{
			shipsOnTile[i][j] = 0;
			if (boardRepresentation[i][j] == 10 || boardRepresentation[i][j] == 110) continue;
			
			if (b->checkSpace(i, j))
			{
				if (b->checkHit(i, j))
				{
					if (b->sunkSpace(i, j))
						boardRepresentation[i][j] = 10;
					else
					{
						boardRepresentation[i][j] = 9;
						hit++;
					}
				}
				else
					boardRepresentation[i][j] = 110;
			}
			else
				boardRepresentation[i][j] = 0;
		}
	}

	if (hit)
	{
		generatePossibleHitLocations(x, y);
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
		attack(x, y);
		return true;
	}
	return false;
}

void MoveGenerator::findNextMove(unsigned int &i, unsigned int &j)
{
	switch(generatorType)
	{
		case 1: randomGenerator(i, j); return;
		case 2: deterministicGenerator(i, j); return;
		case 3: playerAIGenerator(i, j); return;
	}
}

/*
	The random generator was tested with 100,000,000 simulations. The average turns per game
	was 94. It completed 10,571 games per second and ran for 2h:37m:39.919s.
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
		b->attackSpace(i, k, sunk);
		visited[i][k] = true;
	}
	x = i;
	y = k;
}

/*
	The deterministic generator was tested with 100,000,000 simulations. The average turns per game
	was 53. It completed 4270 games per second and ran for 6h:30m:19.436s.
*/
void MoveGenerator::deterministicGenerator(unsigned int &x, unsigned int &y)
{
	if (!b->getTurn())
	{
		static MTRand mtrand;
		unsigned int tmp = mtrand.randInt(1);
		if (skew)
		{
			x = b->getHeight()/2 - tmp;
			y = b->getWidth()/2 - tmp;
		}
		else if (tmp)
		{
			x = b->getHeight()/2 - 1;
			y = b->getWidth()/2 - 0;
		}
		else
		{
			x = b->getHeight()/2 - 0;
			y = b->getWidth()/2 - 1;
		}
		attack(x, y);
	}

	x = y = 0;
	if (!update(x, y))
		randomGenerator(x,y);
}

/*
	The player AI generator was tested with ___ simulations. The average turns per game
	was __. It completed ______ games per second and ran for __h:__m:__.___s.
*/
void MoveGenerator::playerAIGenerator(unsigned int &x, unsigned int &y)
{
	x = y = 0;
	if (!update(x, y))
	{
		std::ifstream boardInput("Previous_Game_Data.txt");
		unsigned long long max = 0;
		for (unsigned int i = 0; i < b->getHeight(); i++)
		{
			for (unsigned int j = 0; j < b->getWidth(); j++)
			{
				unsigned long long tmp;
				boardInput >> tmp;
				if (visited[i][j]) continue;
				if (tmp > max)
				{
					x =  i;
					y = j;
					max = tmp;
				}
				else if (visited[x][y])
				{
					x = i;
					y = j;
				}
			}
		}
		attack(x, y);
	}
}

void MoveGenerator::generatePossibleHitLocations(unsigned int i, unsigned int j)
{
	// If a ship is hit, the calculator will only calculate probabilities for the surrounding tiles until that ship is sunk.
	if (hit)
	{
		for (unsigned int _ = 0; _ < hit; _++) // Runs until there are no hit tiles remaining
		{
			while (boardRepresentation[i][j] != 9) // Finds the next hit tile (top to bottom, left to right)
			{
				if (j < b->getWidth() - 1)
					j++;
				else if (i < b->getHeight()-1)
				{
					j = 0;
					i++;
				}
				else return; // Prevents the loop from testing indices out of bounds. The code should never reach here.
			}
			for (unsigned int ship = 0; ship < b->getNumShips(); ship++)
			{
				if (b->getShipHealth(ship) == 0) continue;

				unsigned int l = b->getShipSize(ship);

				bool up = i != 0 && boardRepresentation[i-1][j] != 110 && boardRepresentation[i-1][j] != 10;
				bool down = i < b->getHeight()-1 && boardRepresentation[i+1][j] != 110 && boardRepresentation[i+1][j] != 10;
				bool left = j != 0 && boardRepresentation[i][j-1] != 110 && boardRepresentation[i][j-1] != 10;
				bool right = j < b->getWidth() - 1 && boardRepresentation[i][j+1] != 110 && boardRepresentation[i][j+1] != 10;

				unsigned int positive_d = 0;
				unsigned int negative_u = 0;
				unsigned int positive_r = 0;
				unsigned int negative_l = 0;

				for (unsigned int k = 1; k < l && (up || down || left || right); k++) // Counts all directions in one loop for a minor optimization
				{
					if (up) // Continues counting until it can no longer go up one tile
					{
						up = i-k != 0 && boardRepresentation[i-k-1][j] != 110 && boardRepresentation[i-k-1][j] != 10;
						negative_u++;
					}
					if (down) // Continues counting until it can no longer go down one tile
					{
						down = i+k < b->getHeight() - 1 && boardRepresentation[i+k+1][j] != 110 && boardRepresentation[i+k+1][j] != 10;
						positive_d++;
					}
					if (left) // Continues counting until it can no longer go left one tile
					{
						left = j-k != 0 && boardRepresentation[i][j-k-1] != 110 && boardRepresentation[i][j-k-1] != 10;
						negative_l++;
					}
					if (right) // Continues counting until it can no longer go right one tile
					{
						right = j+k < b->getWidth() - 1 && boardRepresentation[i][j+k+1] != 110 && boardRepresentation[i][j+k+1] != 10;
						positive_r++;
					}
				}
				if (positive_d + negative_u + 1 >= l)
				{
					for (unsigned int k = i-negative_u; k <= i+positive_d; k++)
					{
						if (boardRepresentation[k][j] == 9) continue; // Avoid counting already hit tiles

						if (k < i)
							shipsOnTile[k][j] += negative_u - (i-k) + 1; // Number of possible ship configurations on this tile if above the hit tile
						else
							shipsOnTile[k][j] += positive_d - (k-i) + 1; // Number of possible ship configurations on this tile if below the hit tile
					}
				}
				if (positive_r + negative_l + 1 >= l)
				{
					for (unsigned int k = j-negative_l; k <= j+positive_r; k++)
					{
						if (boardRepresentation[i][k] == 9) continue; // Avoid counting already hit tiles

						if (k < j)
							shipsOnTile[i][k] += negative_l - (j-k) + 1; // Number of possible ship configurations on this tile if above the hit tile
						else
							shipsOnTile[i][k] += positive_r - (k-j) + 1; // Number of possible ship configurations on this tile if below the hit tile
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
	
	/* In order to optimize runtime, the board does not calculate the best location for every hit. This is due to time constraints. */
}