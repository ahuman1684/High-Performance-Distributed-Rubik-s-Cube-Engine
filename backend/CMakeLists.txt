cmake_minimum_required(VERSION 3.10)

# Project Name
project(RubiksCubeSolver)

# Use C++ 17 Standard (Modern C++)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Optimization Flags (Crucial for the Pattern Database generation)
if(MSVC)
    # Windows Visual Studio flags
    add_compile_options(/O2)
else()
    # Linux/Mac GCC/Clang flags (O3 = Max Speed)
    add_compile_options(-O3)
endif()

# Define the source files
set(SOURCES
    src/main.cpp
    src/RubiksCube.cpp
    src/Solver.cpp
    src/CornerDB.cpp
)

# Create the Executable named "rubiks_solver"
add_executable(rubiks_solver ${SOURCES})

# Output the binary directly to the backend folder (so Python can find it easily)
set_target_properties(rubiks_solver PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/backend")