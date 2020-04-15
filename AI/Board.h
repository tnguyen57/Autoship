#include <iostream>
#include <string>


#ifndef __Board_H
#define __Board_H

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
//                                                 SHIP CLASS                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	The Ship class holds pertainent information about the ship. It does not need to know its location. It will
	keep track of how much health it has, how long it is, whether it has sunk, and its name. 
*/
class Ship
{
public:
	Ship(unsigned int _size, std::string _name);
	~Ship(){}

	bool isSunk() const { return sunk; } // Whether the ship is sunk or not
	unsigned int getSize() const { return size; } // Total length of ship
	unsigned int getHealth() const { return health; } // Remaining "health" of the ship in number of unhit segments
	bool processHit(); // Subtract 1 health from ship and return whether or not the ship has sunk
	std::string getName() const { return name; } // Returns the ship name

private:
	unsigned int size; // Length of the ship
	unsigned int health; // Remaining tiles unhit on the ship
	bool sunk; // Is the health at 0?
	std::string name; // Name of the ship
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
//                                                 NODE CLASS                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	A Node stores information for one space on the board. Each Node points to a Ship object. It's NULL if there is
	no Ship on that space. Each Node also knows if it has been revealed, aka attacked. A Node has no ship to start;
	it is allocated after the fact.
*/
class Node
{
public:

	//CONSTRUCTORS
	Node();
	~Node() {}

	void setShip(Ship* _ship) { ship = _ship; }
	void reveal() { revealed = true; }

	bool hasShip() const ;
	bool isRevealed() const  { return revealed; } // True means that the tile has been hit, false if not hit yet
	bool getShipInfo(std::string &shipName, unsigned int &shipSize,
						unsigned int &shipHealth); // Returns all ship information available and shoots the ship

private:
	Ship* ship;
	bool revealed;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
//                                                BOARD CLASS                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	The Board class drives all functionality of the game. While the MoveGenerator class will call the attacks out,
	the Board class is the one which actually calls the attacks. The board stores information in a dynamic array
	of Node objects. Nodes do not know their location, but the Board keeps track of it. It also holds game stats
	like number of turns, number of ships, board dimensions, the number of sunk ships, and a list of ships on the
	board. 
*/
class Board
{
public:
	Board(unsigned int _height, unsigned int _width, unsigned int _numShips, Ship** _ships); // Normal Constructor
	~Board() { clear(); } // Destructor calls the clear function

	bool checkSpace(unsigned int i, unsigned int j) const { return data[i][j].isRevealed(); } // Checks if a spot has already been attacked
	bool checkHit(unsigned int i, unsigned int j) const { return data[i][j].hasShip(); } // Checks if a Node has a Ship on it
	bool attackSpace(unsigned int i, unsigned int j, bool &sunk); // Returns if the space hit a ship, and sunk returns whether it sunk a ship

	void addShip(unsigned int* i, unsigned int* j, Ship* _ship, unsigned int _size, unsigned int number); // Assigns a ship to a Node object

	unsigned int getHeight() const { return height; } // Gets ship height
	unsigned int getNumShips() const { return numShips; } // Gets number of ships
	unsigned int getWidth() const { return width; } // Get board width
	unsigned int remainingShips() const { return numShips - sunkShips; } // Gets the number of unsunk ships
	unsigned int getTurn() const { return turns; } // Gets the number of turns
	std::string getShipName(unsigned int i) const { return ships[i]->getName(); } // Gets the name of a ship
	unsigned int getShipHealth(unsigned int i) const { return ships[i]->getHealth(); } // Gets the ships health (only for debugging purposes)
	unsigned int getShipSize(unsigned int i) const { return ships[i]->getSize(); } // Gets the size of a ship on the board

	bool gameOver() { return !remainingShips(); } // Returns true when there are 0 remaining ships and false otherwise

private:
	void clear(); // Destructor to deallocate all memory from Nodes and Ship list

	Node** data;
	Ship** ships;
	unsigned int numShips; // Number of total ships
	unsigned int turns; // The number of revealed tiles
	unsigned int height; // The number of rows
	unsigned int width; // The number of columns
	unsigned int sunkShips; // The number of sunk ships
};

std::ostream& operator<< (std::ostream& out, const Board& b); // A print function for the purpose of debugging

#endif