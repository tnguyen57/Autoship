#include <iostream>
#include <string>
#include <vector>
#include "mtrand.h"


#ifndef __snake_H
#define __snake_H

class Ship
{
public:
	Ship(unsigned int _size, std::string _name);
	~Ship(){}

	bool isSunk(); // Whether the ship is sunk or not
	unsigned int getSize(); // Total length of ship
	unsigned int getHealth(); // Remaining "health" of the ship in number of unhit segments
	bool processHit(); // Subtract 1 health from ship and return whether or not the ship has sunk
	std::string getName(); // Returns the ship name

private:
	unsigned int size;
	unsigned int health;
	bool sunk;
	std::string name;
};

class Node
{
public:

	//CONSTRUCTORS
	Node(unsigned int x, unsigned int y);
	~Node(){} //Destructor for formality's sake.

	bool isRevealed(); // True means that the tile has been hit, false if not hit yet
	bool getShipInfo(std::string &shipName, unsigned int &shipSize,
						unsigned int &shipHealth); // Returns all ship information available and shoots the ship


private:
	unsigned int location0; //Holds the i location of a pixel
	unsigned int location1; //Holds the j location of a pixel
	Ship* ship;
};

#endif