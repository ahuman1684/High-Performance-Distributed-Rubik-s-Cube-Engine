#include <emscripten/bind.h>
#include "RubiksCube.h"
#include "Solver.h"
#include <string>
#include <iostream>

using namespace std;

// Helper to convert char to Color enum
Color charToColor(char c) {
    switch(c) {
        case 'W': return WHITE;
        case 'G': return GREEN;
        case 'R': return RED;
        case 'B': return BLUE;
        case 'O': return ORANGE;
        case 'Y': return YELLOW;
        default: return WHITE;
    }
}

// The exposed function
string solveCube(string input_state) {
    RubiksCube cube;
    
    // Parse the input string (54 chars)
    if (input_state.length() >= 54) {
        for (int i = 0; i < 54; i++) {
            cube.cube[i] = charToColor(input_state[i]);
        }
    }

    Solver solver(cube);
    return solver.solve();
}

// Embind: This exports the function to JavaScript
// We use 'emscripten::function' explicitly to avoid conflict with 'std::function'
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("solveCube", &solveCube);
}