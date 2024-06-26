# Makefile for a single C++ source file

# Compiler
CXX = g++

# Compiler flags
CXXFLAGS = -Wall -std=c++17

# Source file
SRC = evolve.cpp

# Object file (derived from the source file)
OBJ = $(SRC:.cpp=.o)

# Executable target
TARGET = evolve

# Default rule (builds the executable)
all: $(TARGET)

# Rule to link the object file and create the executable
$(TARGET): $(OBJ)
	$(CXX) $(OBJ) -o $(TARGET)

# Rule to compile the source file into an object file
$(OBJ): $(SRC)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean rule to remove generated files
clean:
	rm -f $(OBJ) $(TARGET)

# Phony targets (not files, but commands)
.PHONY: all clean
