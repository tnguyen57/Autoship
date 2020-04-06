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

