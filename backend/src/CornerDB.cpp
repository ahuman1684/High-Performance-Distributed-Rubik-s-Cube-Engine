#include "CornerDB.h"
#include <queue>
#include <iostream>
#include <fstream>

using namespace std;

CornerDB::CornerDB() {
    // Size: 88,179,840 entries (~88 MB)
    database.resize(88179840, 0xFF);
    
    // DESKTOP MODE (Python/CLI)
    // Try to load from file first to save startup time
    if (load()) {
        cout << "[INFO] Database Loaded from file! (Instant Startup)" << endl;
    } else {
        // If file doesn't exist, generate it
        cout << "[INFO] Generating Database... (This will take time)" << endl;
        generateDatabase();
        save(); // Save it for next time
    }
}

uint8_t CornerDB::getEstimate(const RubiksCube& cube) {
    uint32_t index = cube.getCornerIndex();
    if (index < database.size()) {
        return database[index];
    }
    return 0; // Should not happen
}

// Save the 88MB array to disk
bool CornerDB::save() {
    ofstream out(filename, ios::binary);
    if (!out) return false;
    out.write(reinterpret_cast<const char*>(database.data()), database.size());
    cout << "[INFO] Database saved to " << filename << endl;
    return true;
}

// Load the 88MB array from disk
bool CornerDB::load() {
    ifstream in(filename, ios::binary);
    if (!in) return false;
    
    // Check file size matches expected size
    in.seekg(0, ios::end);
    size_t fileSize = in.tellg();
    in.seekg(0, ios::beg);
    
    if (fileSize != database.size()) {
        return false; // Corrupt or old version
    }
    
    in.read(reinterpret_cast<char*>(database.data()), database.size());
    return true;
}

void CornerDB::generateDatabase() {
    RubiksCube solvedCube;
    uint32_t startIdx = solvedCube.getCornerIndex();
    
    queue<RubiksCube> q;
    q.push(solvedCube);
    
    database[startIdx] = 0;
    
    while(!q.empty()) {
        RubiksCube current = q.front();
        q.pop();
        
        uint32_t currentIdx = current.getCornerIndex();
        uint8_t currentDepth = database[currentIdx];
        
        if (currentDepth >= 11) continue;

        for (int m=0; m<18; m++) {
            RubiksCube next = current;
            next.move(static_cast<Move>(m));
            
            uint32_t nextIdx = next.getCornerIndex();
            
            if (database[nextIdx] == 0xFF) {
                database[nextIdx] = currentDepth + 1;
                q.push(next);
            }
        }
    }
}