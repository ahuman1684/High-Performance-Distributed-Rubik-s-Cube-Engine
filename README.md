# High-Performance Distributed Rubik's Cube Engine

A full-stack, distributed application that optimally solves the Rubik's Cube (3x3) using **Korf’s IDA* Algorithm** and a **Pattern Database Heuristic**.

The system features a **C++17 Compute Engine** optimized for L1 cache locality, a **Python Flask Middleware** for process management, and a **React + Three.js Frontend** for real-time 3D visualization.

---

![Demo Image](images/demo.png)

## 🚀 Key Features

* **Optimal Solver (IDA*):** Finds solutions close to "God's Number" (≤ 20 moves) using Iterative Deepening A*.
* **Pattern Database Heuristic:** Pre-computes 88 million corner states into a lookup table for $O(1)$ pruning.
* **Performance Optimization:** Uses bitwise state representation and flat 1D vectors to fit data in CPU L1 Cache.
* **Hybrid "Smart" Solver:** Implements a fallback bidirectional search strategy to resolve high-entropy states (Depth 20+) under strict time constraints.
* **Dockerized Architecture:** Deploys via a multi-stage Docker build, separating the heavy C++ compilation environment from the lightweight Python runtime.

---

## 🛠️ Tech Stack

* **Compute Engine:** C++17, STL, CMake
* **API Middleware:** Python 3.9, Flask
* **Frontend:** React 18, Three.js (React Three Fiber), Tailwind CSS
* **Infrastructure:** Docker (Multi-stage builds)

---

## 🏗️ Architecture

The application follows a **Decoupled Microservices Architecture**:

1.  **Frontend (React):** Manages 3D state and user interaction. Sends algebraic notation requests to the API.
2.  **Middleware (Python):** Orchestrates the C++ subprocess. Handles timeouts (120s) and formats JSON responses.
3.  **Backend (C++):**
    * **Startup:** Loads the 88MB `corner.db` file into RAM (via memory mapping or fast I/O) in <0.1s.
    * **Execution:** Performs graph search on the permutation state.
    * **Heuristic:** Uses Lehmer Codes (Factorial Number System) to map 3D corner positions to linear database indices.

---

## 🐳 Docker Setup (Recommended)

Run the entire stack without installing C++ compilers manually.

### 1. Build the Image
This compiles the C++ engine and generates the 88MB Pattern Database inside the container.
```bash
docker build -t rubiks-backend .
2. Run the Container

Starts the API on port 5000.
docker run -p 5000:5000 rubiks-backend
3. Start Frontend

Open a new terminal.
cd frontend
npm install
npm run dev

Visit http://localhost:5173 to use the solver.
