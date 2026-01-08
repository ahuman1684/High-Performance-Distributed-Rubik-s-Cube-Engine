#ifndef SOLVER_H
#define SOLVER_H

#include "RubiksCube.h"
#include "CornerDB.h"
#include <vector>
#include <string>

using namespace std;

class Solver {
    RubiksCube initialState;
    vector<Move> solutionMoves;
    int maxDepth;
    
    // STATIC: Shared across all solver instances so we generate it only ONCE.
    static CornerDB cornerDB; 

public:
    Solver(RubiksCube cube);
    string solve();

private:
    int search(RubiksCube& currentCube, int g, int bound);
    int heuristic(const RubiksCube& cube);
    string moveToString(Move m);
};

#endif