#include "RubiksCube.h"

// ==========================================
// PHASE 1 LOGIC: BASIC CUBE OPERATIONS
// ==========================================

// Helper: Converts enum to string for printing
string getColorChar(Color c) {
    switch (c) {
        case WHITE: return "W";
        case GREEN: return "G";
        case RED: return "R";
        case BLUE: return "B";
        case ORANGE: return "O";
        case YELLOW: return "Y";
        default: return "X";
    }
}

// Constructor: Initializes a solved cube
RubiksCube::RubiksCube() {
    cube.resize(54);
    for (int i = 0; i < 54; ++i) {
        // Map 0-8 -> 0 (White), 9-17 -> 1 (Green), etc.
        cube[i] = static_cast<Color>(i / 9);
    }
}

Color RubiksCube::getColor(Face face, int row, int col) const {
    int index = (int)face * 9 + row * 3 + col;
    return cube[index];
}

bool RubiksCube::isSolved() const {
    for (int i = 0; i < 54; ++i) {
        if (cube[i] != static_cast<Color>(i / 9)) return false;
    }
    return true;
}

void RubiksCube::print() const {
    cout << "Rubik's Cube State:" << endl;
    for (int i = 0; i < 54; ++i) {
        if (i % 9 == 0) cout << "Face " << i/9 << ": ";
        cout << getColorChar(cube[i]) << " ";
        if (i % 9 == 8) cout << endl;
    }
    cout << "-------------------" << endl;
}

// Rotates a face clockwise (the stickers on the face itself)
void RubiksCube::rotateFace(Face face) {
    int offset = (int)face * 9;
    vector<Color> temp = cube;
    
    // Corners
    cube[offset + 0] = temp[offset + 6];
    cube[offset + 2] = temp[offset + 0];
    cube[offset + 8] = temp[offset + 2];
    cube[offset + 6] = temp[offset + 8];

    // Edges
    cube[offset + 1] = temp[offset + 3];
    cube[offset + 5] = temp[offset + 1];
    cube[offset + 7] = temp[offset + 5];
    cube[offset + 3] = temp[offset + 7];
}

// --- BASIC MOVES IMPLEMENTATION ---

void RubiksCube::u() {
    rotateFace(UP);
    vector<Color> temp = cube;
    for (int i = 0; i < 3; i++) {
        cube[9 + i] = temp[18 + i];  // Left <- Front
        cube[36 + i] = temp[9 + i];  // Back <- Left
        cube[27 + i] = temp[36 + i]; // Right <- Back
        cube[18 + i] = temp[27 + i]; // Front <- Right
    }
}
void RubiksCube::uPrime() { u(); u(); u(); }
void RubiksCube::u2() { u(); u(); }

void RubiksCube::l() {
    rotateFace(LEFT);
    vector<Color> temp = cube;
    // Up -> Front
    cube[18] = temp[0]; cube[21] = temp[3]; cube[24] = temp[6];
    // Front -> Down
    cube[45] = temp[18]; cube[48] = temp[21]; cube[51] = temp[24];
    // Down -> Back
    cube[44] = temp[45]; cube[41] = temp[48]; cube[38] = temp[51];
    // Back -> Up
    cube[0] = temp[44]; cube[3] = temp[41]; cube[6] = temp[38];
}
void RubiksCube::lPrime() { l(); l(); l(); }
void RubiksCube::l2() { l(); l(); }

void RubiksCube::f() {
    rotateFace(FRONT);
    vector<Color> temp = cube;
    cube[27] = temp[6]; cube[30] = temp[7]; cube[33] = temp[8]; // U->R
    cube[47] = temp[27]; cube[46] = temp[30]; cube[45] = temp[33]; // R->D
    cube[17] = temp[47]; cube[14] = temp[46]; cube[11] = temp[45]; // D->L
    cube[6] = temp[17]; cube[7] = temp[14]; cube[8] = temp[11]; // L->U
}
void RubiksCube::fPrime() { f(); f(); f(); }
void RubiksCube::f2() { f(); f(); }

void RubiksCube::r() {
    rotateFace(RIGHT);
    vector<Color> temp = cube;
    cube[36] = temp[8]; cube[39] = temp[5]; cube[42] = temp[2]; // U->B
    cube[53] = temp[36]; cube[50] = temp[39]; cube[47] = temp[42]; // B->D
    cube[26] = temp[53]; cube[23] = temp[50]; cube[20] = temp[47]; // D->F
    cube[8] = temp[26]; cube[5] = temp[23]; cube[2] = temp[20]; // F->U
}
void RubiksCube::rPrime() { r(); r(); r(); }
void RubiksCube::r2() { r(); r(); }

void RubiksCube::b() {
    rotateFace(BACK);
    vector<Color> temp = cube;
    cube[9] = temp[2]; cube[12] = temp[1]; cube[15] = temp[0]; // U->L
    cube[51] = temp[9]; cube[52] = temp[12]; cube[53] = temp[15]; // L->D
    cube[35] = temp[51]; cube[32] = temp[52]; cube[29] = temp[53]; // D->R
    cube[2] = temp[35]; cube[1] = temp[32]; cube[0] = temp[29]; // R->U
}
void RubiksCube::bPrime() { b(); b(); b(); }
void RubiksCube::b2() { b(); b(); }

void RubiksCube::d() {
    rotateFace(DOWN);
    vector<Color> temp = cube;
    cube[33] = temp[24]; cube[34] = temp[25]; cube[35] = temp[26]; // F->R
    cube[42] = temp[33]; cube[43] = temp[34]; cube[44] = temp[35]; // R->B
    cube[15] = temp[42]; cube[16] = temp[43]; cube[17] = temp[44]; // B->L
    cube[24] = temp[15]; cube[25] = temp[16]; cube[26] = temp[17]; // L->F
}
void RubiksCube::dPrime() { d(); d(); d(); }
void RubiksCube::d2() { d(); d(); }

// Central Move Dispatcher
void RubiksCube::move(Move m) {
    switch(m) {
        case U: u(); break; case UPRIME: uPrime(); break; case U2: u2(); break;
        case L: l(); break; case LPRIME: lPrime(); break; case L2: l2(); break;
        case F: f(); break; case FPRIME: fPrime(); break; case F2: f2(); break;
        case R: r(); break; case RPRIME: rPrime(); break; case R2: r2(); break;
        case B: b(); break; case BPRIME: bPrime(); break; case B2: b2(); break;
        case D: d(); break; case DPRIME: dPrime(); break; case D2: d2(); break;
    }
}

// ==========================================
// PHASE 2 LOGIC: PATTERN DATABASE INDEXING
// ==========================================

const int factorialLookup[] = {1, 1, 2, 6, 24, 120, 720, 5040};

const int cornerFacelets[8][3] = {
    {0, 9, 38},   // ULB
    {2, 36, 29},  // URB
    {8, 27, 20},  // URF
    {6, 18, 11},  // ULF
    {45, 24, 17}, // DLF
    {47, 15, 44}, // DLB
    {53, 42, 35}, // DRB
    {51, 33, 26}  // DRF
};

int RubiksCube::getCornerOrientation(int cornerPos) const {
    Color c = cube[cornerFacelets[cornerPos][0]]; 
    if (c == WHITE || c == YELLOW) return 0;
    
    c = cube[cornerFacelets[cornerPos][1]];
    if (c == WHITE || c == YELLOW) return 1;
    
    return 2;
}

int RubiksCube::getCornerId(int cornerPos) const {
    bool cols[6] = {false};
    for(int i=0; i<3; i++) {
        cols[cube[cornerFacelets[cornerPos][i]]] = true;
    }

    if (cols[WHITE] && cols[ORANGE] && cols[GREEN]) return 0; // ULB
    if (cols[WHITE] && cols[BLUE] && cols[ORANGE]) return 1; // URB
    if (cols[WHITE] && cols[RED] && cols[BLUE]) return 2; // URF
    if (cols[WHITE] && cols[GREEN] && cols[RED]) return 3; // ULF
    
    if (cols[YELLOW] && cols[GREEN] && cols[RED]) return 4; // DLF
    if (cols[YELLOW] && cols[ORANGE] && cols[GREEN]) return 5; // DLB
    if (cols[YELLOW] && cols[BLUE] && cols[ORANGE]) return 6; // DRB
    if (cols[YELLOW] && cols[RED] && cols[BLUE]) return 7; // DRF
    
    return 0; 
}

uint32_t RubiksCube::getCornerIndex() const {
    int permutation[8];
    for (int i=0; i<8; i++) permutation[i] = getCornerId(i);
    
    int permIndex = 0;
    for (int i=0; i<7; i++) {
        int smallerCount = 0;
        for (int j=i+1; j<8; j++) {
            if (permutation[j] < permutation[i]) smallerCount++;
        }
        permIndex += smallerCount * factorialLookup[7 - i];
    }

    int orientIndex = 0;
    for (int i=0; i<7; i++) {
        orientIndex = orientIndex * 3 + getCornerOrientation(i);
    }

    return (permIndex * 2187) + orientIndex;
}