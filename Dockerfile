# ==========================================
# STAGE 1: Build C++ Engine & Generate DB
# ==========================================
FROM ubuntu:22.04 as cpp-builder

# 1. Install Build Tools (Just g++ is enough now)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 2. Set working directory
WORKDIR /app

# 3. Copy Source Code
COPY backend/src ./src

# 4. Compile Directly with g++
# We explicitly list files to avoid compiling 'wasm_bridge.cpp' which breaks the build
RUN g++ -O3 -std=c++17 -o rubiks_solver \
    src/main.cpp \
    src/RubiksCube.cpp \
    src/Solver.cpp \
    src/CornerDB.cpp

# 5. Generate the Pattern Database
# This runs the solver once to create corner.db
RUN ./rubiks_solver

# ==========================================
# STAGE 2: Python Runtime
# ==========================================
FROM python:3.9-slim

# 1. Install runtime libraries
RUN apt-get update && apt-get install -y \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy Python Code
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/app.py .

# 3. Copy Compiled Artifacts
WORKDIR /app/backend
COPY --from=cpp-builder /app/rubiks_solver .
COPY --from=cpp-builder /app/corner.db .

# 4. Env Vars
ENV SOLVER_PATH=/app/backend/rubiks_solver
ENV BACKEND_WORK_DIR=/app/backend

# 5. Run
EXPOSE 5000
WORKDIR /app
CMD ["python", "app.py"]