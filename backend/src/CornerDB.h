#ifndef CORNERDB_H
#define CORNERDB_H

#include "RubiksCube.h"
#include <vector>
#include <cstdint>
#include <string>

using namespace std;

class CornerDB {
    vector<uint8_t> database;
    string filename = "corner.db"; // The file where we save the brain
    
public:
    CornerDB(); 
    uint8_t getEstimate(const RubiksCube& cube);
    void generateDatabase();
    
    // --- NEW PERSISTENCE HELPERS ---
    bool load();
    bool save();
};

#endif