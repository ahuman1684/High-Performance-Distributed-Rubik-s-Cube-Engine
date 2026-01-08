#include "Solver.h"
#include <algorithm>
#include <limits>
#include <iostream>

using namespace std;

// Initialize the static database
// This line triggers the Constructor of CornerDB -> calls generateDatabase()
CornerDB Solver::cornerDB;

Solver::Solver(RubiksCube cube) : initialState(cube), maxDepth(20) {}

string Solver::moveToString(Move m) {
    switch(m) {
        case U: return "U"; case UPRIME: return "U'"; case U2: return "U2";
        case L: return "L"; case LPRIME: return "L'"; case L2: return "L2";
        case F: return "F"; case FPRIME: return "F'"; case F2: return "F2";
        case R: return "R"; case RPRIME: return "R'"; case R2: return "R2";
        case B: return "B"; case BPRIME: return "B'"; case B2: return "B2";
        case D: return "D"; case DPRIME: return "D'"; case D2: return "D2";
        default: return "";
    }
}

// THE HEURISTIC: "How far are the corners from solved?"
int Solver::heuristic(const RubiksCube& cube) {
    return (int)cornerDB.getEstimate(cube);
}

// IDA* Search Algorithm
int Solver::search(RubiksCube& currentCube, int g, int bound) {
    int f = g + heuristic(currentCube);
    
    // 1. Pruning (The "Brain" part)
    if (f > bound) return f;
    
    // 2. Goal Check
    if (currentCube.isSolved()) return -1; // Found

    int min_val = numeric_limits<int>::max();

    for (int m = 0; m < 18; m++) {
        // Optimization: Don't undo immediate previous move (L L' is useless)
        if (!solutionMoves.empty()) {
            Move last = solutionMoves.back();
            if (last == m + (m % 3 == 0 ? 1 : -1)) continue; 
            if (m/3 == last/3 && m < last) continue; // Commutative pruning
        }

        RubiksCube nextState = currentCube;
        nextState.move(static_cast<Move>(m));
        solutionMoves.push_back(static_cast<Move>(m));

        // Recursive Step
        int t = search(nextState, g + 1, bound);
        if (t == -1) return -1; // Found
        if (t < min_val) min_val = t;

        solutionMoves.pop_back(); // Backtrack
    }
    return min_val;
}

string Solver::solve() {
    cout << "Starting IDA* Search..." << endl;
    int bound = heuristic(initialState);
    
    while (bound <= maxDepth) {
        cout << "Searching depth: " << bound << endl;
        int t = search(initialState, 0, bound);
        if (t == -1) {
            string result = "";
            for (Move m : solutionMoves) result += moveToString(m) + " ";
            return result;
        }
        bound = t;
    }
    return "Solution not found (Max Depth Reached)";
}
