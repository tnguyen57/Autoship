#include <iostream>
#include <string>


#ifndef __Board_H
#define __Board_H

class Ship
{
public:
	Ship(unsigned int _size, std::string _name);
	~Ship(){}

	bool isSunk() { return sunk; } // Whether the ship is sunk or not
	unsigned int getSize() { return size; } // Total length of ship
	unsigned int getHealth() { return health; } // Remaining "health" of the ship in number of unhit segments
	bool processHit(); // Subtract 1 health from ship and return whether or not the ship has sunk
	std::string getName() { return name; } // Returns the ship name

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
	Node();
	~Node() {}

	void setShip(Ship* _ship) { ship = _ship; }
	void reveal() { revealed = true; }

	bool hasShip();
	bool isRevealed() { return revealed; } // True means that the tile has been hit, false if not hit yet
	bool getShipInfo(std::string &shipName, unsigned int &shipSize,
						unsigned int &shipHealth); // Returns all ship information available and shoots the ship

private:
	Ship* ship;
	bool revealed;
};

class Board
{
public:
	Board(unsigned int _height, unsigned int _width, unsigned int _numShips, Ship** _ships);
	~Board();

	bool checkSpace(unsigned int i, unsigned int j) const { return data[i][j].isRevealed(); }
	bool checkHit(unsigned int i, unsigned int j) const { return data[i][j].hasShip(); }
	bool attackSpace(unsigned int i, unsigned int j, bool &sunk);
	void clear();

	void addShip(unsigned int* i, unsigned int* j, Ship* _ship, unsigned int _size, unsigned int number);

	unsigned int getHeight() const { return height; }
	unsigned int getNumShips() const { return numShips; }
	unsigned int getWidth() const { return width; }
	unsigned int remainingShips() const { return numShips - sunkShips; }
	unsigned int getTurn() const { return turns; }
	std::string getShipName(unsigned int i) const { return ships[i]->getName(); }
	unsigned int getShipHealth(unsigned int i) const { return ships[i]->getHealth(); }
	unsigned int getShipSize(unsigned int i) const { return ships[i]->getSize(); }

	bool gameOver() { return !remainingShips(); }

private:
	Node** data;
	Ship** ships;
	unsigned int numShips;
	unsigned int turns;
	unsigned int height;
	unsigned int width;
	unsigned int sunkShips;
};

std::ostream& operator<< (std::ostream& out, const Board& b);

#endif