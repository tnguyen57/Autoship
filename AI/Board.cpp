#include "Board.h"

Ship::Ship(unsigned int _size, std::string _name)
{
	size = _size;
	health = _size;
	sunk = false;
	name = _name;
}

bool Ship::processHit()
{
	health--;
	return sunk = !health;
}

Node::Node()
{
	revealed = false;
	ship = NULL;
}

bool Node::hasShip() const
{
	if (!ship)
		return false;
	return true;
}

bool Node::getShipInfo(std::string &shipName, unsigned int &shipSize,
						unsigned int &shipHealth)
{
	shipName = ship->getName();
	shipSize = ship->getSize();
	shipHealth = ship->getHealth();
	reveal();
	return ship->processHit(); // returns true for a sunk ship and false for no sunk ship
}

Board::Board(unsigned int _height, unsigned int _width, unsigned int _numShips, Ship** _ships)
{
	height = _height;
	width = _width;
	numShips = _numShips;
	ships = _ships;
	turns = 0;
	sunkShips = 0;
	data = new Node*[height];
	for (unsigned int i = 0; i < height; i++)
	{
		data[i] = new Node[width];
		for (unsigned int j = 0; j < width; j++)
			data[i][j] = Node();
	}
}

void Board::clear()
{
	for (unsigned int i = 0; i < width; i++) {
		delete [] data[i];
	}
	delete [] data;
	for (unsigned int i = 0; i < numShips; i++)
	{
		delete ships[i];
	}
	delete [] ships;
	data = NULL;
	height = 0;
	width = 0;
	turns = 0;
	numShips = 0;
}

bool Board::attackSpace(unsigned int i, unsigned int j, bool &sunk)
{
	if (!data[i][j].hasShip())
	{
		turns++;
		data[i][j].reveal();
		return false;
	}
	std::string shipName;
	unsigned int shipSize;
	unsigned int shipHealth;
	sunk = data[i][j].getShipInfo(shipName, shipSize, shipHealth);
	if (sunk)
		sunkShips++;
	turns++;
	return true;
}

void Board::addShip(unsigned int* i, unsigned int* j, Ship* _ship, unsigned int _size, unsigned int number)
{
	for (unsigned int k = 0; k < _size; k++)
		data[i[k]][j[k]].setShip(_ship);
	ships[number] = _ship;
}

std::ostream& operator<< (std::ostream& out, const Board& b)
{
	out << "Turn Number " << b.getTurn() << "\nOpponent's Board:\n";
	for (unsigned int i = 0; i < b.getHeight(); i++)
	{
		out << std::endl;
		for (unsigned int j = 0; j < b.getWidth(); j++)
		{
			if (!b.checkSpace(i, j))
				out << "? ";
			else if (b.checkHit(i, j))
				out << "X ";
			else
				out << "O ";
		}
	}
	out << "\nOf the " << b.getNumShips() << " original ships, there are "
		<< b.remainingShips() << " remaining:\n";
	for (unsigned int i = 0; i < b.getNumShips(); i++)
	{
		if (b.getShipHealth(i) == 0)
			continue;
		out << "\t" << b.getShipName(i) << " " << b.getShipHealth(i) << "/" << b.getShipSize(i) << std::endl;
	}
	return out;
}