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
	!health = sunk;
	return sunk;
}

