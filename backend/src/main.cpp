#include "RubiksCube.h"
#include "Solver.h"
#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Helper to map character to Color enum
Color charToColor(char c) {
    switch(c) {
        case 'W': return WHITE;
        case 'G': return GREEN;
        case 'R': return RED;
        case 'B': return BLUE;
        case 'O': return ORANGE;
        case 'Y': return YELLOW;
        default: return WHITE; // Default fallback
    }
}

int main(int argc, char* argv[]) {
    RubiksCube cube;
    
    // If a string is provided via CLI (e.g., from Python)
    // Format: 54 characters "WWWWGGGG..."
    if (argc > 1) {
        string input = argv[1];
        if (input.length() >= 54) {
            for (int i = 0; i < 54; i++) {
                cube.cube[i] = charToColor(input[i]);
            }
        }
    } else {
        // Test Scramble if no input provided
        cout << "[DEBUG] No input provided. Using test scramble (R U R' U')." << endl;
        cube.move(R); 
        cube.move(U);
        cube.move(RPRIME);
        cube.move(UPRIME);
    }

    Solver solver(cube);
    string solution = solver.solve();
    
    // Print ONLY the solution string to stdout so Python can capture it
    cout << solution << endl;
    
    return 0;
}