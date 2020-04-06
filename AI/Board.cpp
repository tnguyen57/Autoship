#include <iostream>
#include <string>
#include <vector>
#include "mtrand.h"
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
	sunk = !health;
	return sunk;
}

Node::Node()
{
	revealed = false;
	ship = NULL;
}

bool Node::hasShip()
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
	return ship->processHit(); // returns true for a sunk ship and false for no sunk ship
}

Board::Board(unsigned int _height, unsigned int _width, unsigned int _numShips)
{
	height = _height;
	width = _width;
	numShips = _numShips;
	turns = 0;
	data = new Node*[height];
	for (unsigned int i = 0; i < height; i++)
	{
		data[i] = new Node[width];
		for (unsigned int j = 0; j < width; j++)
			data[i][j] = Node();
	}
}

Board::~Board()
{
	for (unsigned int i = 0; i < width; i++) {
		delete [] data[i];
	}
	delete [] data;
	data = NULL;
	height = 0;
	width = 0;
	turns = 0;
	numShips = 0;
}