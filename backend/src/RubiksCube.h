#ifndef RUBIKSCUBE_H
#define RUBIKSCUBE_H

#include <vector>
#include <string>
#include <iostream>
#include <cstdint>

using namespace std;

// Standard Rubik's Cube Definitions
enum Color { WHITE, GREEN, RED, BLUE, ORANGE, YELLOW };
enum Face { UP, LEFT, FRONT, RIGHT, BACK, DOWN };
enum Move { U, UPRIME, U2, L, LPRIME, L2, F, FPRIME, F2, R, RPRIME, R2, B, BPRIME, B2, D, DPRIME, D2 };

class RubiksCube {
public:
    vector<Color> cube;

    // Constructor
    RubiksCube();

    Color getColor(Face face, int row, int col) const;
    bool isSolved() const;
    void print() const;

    // Perform a Move
    void move(Move m);
    
    // --- PHASE 2: NEW INDEXING HELPERS ---
    // These functions allow the cube to calculate its own unique ID
    // for the Pattern Database lookup.
    
    // Returns a unique integer (0 to 88,179,840) representing the corner state.
    uint32_t getCornerIndex() const;

    // Helper: Which physical corner piece is at this position? (0-7)
    int getCornerId(int cornerPos) const;

    // Helper: How is that corner twisted? (0, 1, 2)
    int getCornerOrientation(int cornerPos) const;

private:
    void rotateFace(Face face);
    // Basic Moves
    void u(); void uPrime(); void u2();
    void l(); void lPrime(); void l2();
    void f(); void fPrime(); void f2();
    void r(); void rPrime(); void r2();
    void b(); void bPrime(); void b2();
    void d(); void dPrime(); void d2();
};

#endif