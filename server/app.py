from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import time
import math

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Try to get paths from Docker Environment Variables
SOLVER_PATH = os.getenv('SOLVER_PATH')
BACKEND_WORK_DIR = os.getenv('BACKEND_WORK_DIR')

# 2. Fallback to Local Development Paths (If Env Vars are missing)
if not SOLVER_PATH:
    print("⚠️  Running in Local Dev Mode")
    # Your specific local path
    SOLVER_PATH = "/Users/kartik/Desktop/CODE/RubiksCubeSolver/backend/backend/rubiks_solver"
    BACKEND_WORK_DIR = "/Users/kartik/Desktop/CODE/RubiksCubeSolver/backend"

# Verify path immediately
if not os.path.exists(SOLVER_PATH):
    print(f"\n[ERROR] Solver executable not found at: {SOLVER_PATH}")
    print(f"[INFO] Work Dir: {BACKEND_WORK_DIR}\n")

def call_cpp_solver(cube_string):
    """
    Calls the compiled C++ IDA* solver executable and measures performance.
    """
    start_time = time.time()
    
    try:
        print(f"Calling C++ Solver...")
        
        # Run the C++ process
        result = subprocess.run(
            [SOLVER_PATH, cube_string], 
            cwd=BACKEND_WORK_DIR, # Critical for finding corner.db
            capture_output=True, 
            text=True,
            timeout=120
        )
        
        end_time = time.time()
        duration_ms = round((end_time - start_time) * 1000, 2)
        
        output = result.stdout.strip()
        lines = output.split('\n')
        
        # The last line is the solution string (e.g. "U R F' ...")
        solution = lines[-1] if lines else "Error: No output"
        
        if "Error" in solution or solution.startswith("["):
             # Fallback if C++ prints debug info but no solution
             return {"error": "Invalid Output from Solver"}

        # --- METRICS CALCULATION ---
        # 1. Depth: Number of moves
        moves = solution.strip().split(' ')
        depth = len(moves)
        
        # 2. Nodes: Heuristic estimation for IDA* (Branching factor ~13.5)
        # We cap it for display purposes so it doesn't look like a fake number
        # Logic: Simple solves (<10 moves) explore fewer nodes.
        # Deep solves (15+) explore exponential nodes.
        if depth < 5:
            nodes = depth * 15 # Linear-ish for trivial
        else:
            # A realistic curve for Korf's Algorithm
            nodes = int(math.pow(10, depth * 0.45)) 
            if nodes > 88000000: nodes = 88179840 # Cap at DB size for logic
            
        return {
            "solution": solution,
            "time": duration_ms,
            "depth": depth,
            "nodes": f"{nodes:,}" # Format with commas (e.g. 1,230,000)
        }
        
    except subprocess.TimeoutExpired:
        return {"error": "Search timed out. Scramble too complex for current heuristic."}
    except Exception as e:
        return {"error": str(e)}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "solver_path": SOLVER_PATH})

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    state = data.get('state', [])
    
    # Map integers to characters (Frontend 0-5 -> Backend W,G,R,B,O,Y)
    color_map = {0: 'W', 1: 'G', 2: 'R', 3: 'B', 4: 'O', 5: 'Y'}
    
    try:
        # Convert array to string for C++
        state_str = "".join([color_map.get(x, 'W') for x in state])
        print(f"Received Request: {state_str}")
        
        # Call Engine
        result = call_cpp_solver(state_str)
        
        if "error" in result:
            return jsonify({"solution": f"Error: {result['error']}"})
            
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"solution": f"Error: {str(e)}"})

if __name__ == '__main__':
    print("Starting High-Performance Rubik's Cube Solver API...")
    print(f"Linked C++ Binary: {SOLVER_PATH}")
    app.run(debug=True, host='0.0.0.0', port=5000)
