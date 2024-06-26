# Evolution Simulation Project

## How to play

You can go play this game at

```bash
https://fast-reaches-37987-bde7d538d636.herokuapp.com
```

## Overview

Welcome to the Evolutionary Simulation project! This project simulates the dynamic interactions and evolution of two species types: *guys* (creatures) and *trees* (food sources). The simulation models how these species evolve over multiple generations through natural selection, competition, predation, and reproduction.

The project is implemented using C++ for the simulation backend, JavaScript (with Node.js) for the frontend user interface, and Python for generating population graphs.

## Components

### Backend (C++)

- **Guy**: Represents a creature with attributes such as size, speed, food requirement, location, and whether it is a predator.
- **Tree**: Represents a food source with attributes like height, location, and the number of fruits.
- **Simulation**: Orchestrates the interaction between guys and trees, handling the evolution process over multiple generations.

### Frontend (JavaScript, CSS, HTML)

- **index.html**: Provides the user interface for inputting simulation parameters.
- **script.js**: Handles user input validation, sends data to the server for simulation execution, and displays results back to the user.
- **server.js**: Node.js server script that handles incoming requests, executes the C++ simulation, and serves the frontend files.
- **styles.css**: Improves look of user interface

### Graph Generation (Python)

- **graphGens.py**: Python script that reads simulation results from `out.csv`, generates a stacked line graph using `matplotlib`, and visualizes the population dynamics of prey and predator species over generations.

## Screenshots

![User Interface](Screenshots/Top.png)

![Scoring](Screenshots/Mid.png)

![Results](Screenshots/Bottom.png)

## Frontend Results

The front end only shows the number of creatures, predators, and preys throughout each generation (accompanied 
by the Python graphical representation of this data). In order to see more in depth results and statistics, read output when running `evolve.cpp` **without** quiet mode being turned on (i.e. without the `--quiet` tag).

The frontend simulation automatically compiles in quiet mode to improve runtime.

## Input Format

The input is read from standard input or a file and follows this structure:

1. **Number of Guys**: An integer indicating how many guys will be in the simulation initially.
2. **Guys' Data**: Each guy is defined by five attributes:
- **Size**: The size of the guy. Bigger guys get first access to trees and are able to access higher trees. Additionally, predators can only kill other guys when they are a larger size.
- **Speed**: The speed of the guy, enabling them to reach trees that are farther way.
- **Food Needed**: The amount of food the guy needs to survive.
- **Location**: The 1 dimensional location of the guy.
- **Predator**: Indicates if the guy is a predator (1 for predator, 0 for prey).
3. **Number of Trees**: An integer indicating how many trees will be in the simulation initially.
4. **Trees' Data**: Each tree is defined by three attributes:
- **Height**: The height of the tree.
- **Location**: The 1 dimensional location of the tree.
- **Number of Fruits**: The number of fruits the tree initially has, each one feeds 0.5 of a guy's appetite.

### Example input:

```markdown
3
4.0 1.5 2.0 3.0 0
3.2 1.3 2.2 2.0 1
2.1 1.4 1.9 1.0 0
2
2.0 2.0 10
3.3 3.0 8
10
```

### In this example:

- There are 3 guys (1 prey and 1 predator) with specific attributes.
- There are 2 trees with specific attributes.
- The simulation runs for 10 generations.

## Features

- **Natural Selection**: Guys compete for food (fruits from trees). Those who cannot meet their food requirements die off, while the survivors reproduce.
- **Reproduction**: Surviving guys reproduce, passing on their traits with slight variations to the next generation. There is 0.5% chance a predator will mutate into a prey and vice versa.
- **Predation**: Some guys are predators and can kill other guys to meet their food requirements. However, prey will attempt to help each other and may be able to survive without sufficient food. This creates a dynamic of `Game Theory` as intitial conditions may determine which species of creatures survive.
- **Tree Reproduction**: Trees with sufficient fruits reamining can reproduce and spread in the environment.
- **Statistics**: After each generation, the simulation provides detailed statistics about the surviving guys and trees.

## Getting Started

### Prerequisites

To build and run the simulation, you need the following:

- Node.js installed on your machine.
- A C++ compiler supporting C++17 or later.
- Standard C++ libraries.
- Python installed with `matplotlib` and `pandas` libraries.

### Setting Up the Project

1. **Clone the repository**:

```markdown
git clone https://github.com/micdwill/Evolution-Simulator
cd evolution
```

2. **Install Node.js dependencies**:

If there are any specific Node.js packages required (such as `express`, `cors`, etc.), install them using:

```markdown
npm install
```

3. **Compile the C++ code**:

Compile `evolve.cpp` to generate the `evolve` executable using the `Makefile`.

```markdown
make
```

### Running the Frontend Simulation Locally

1. **Start the Node.js server**:

Launch the Node.js server which will handle the simulation requests and serve the frontend:

```markdown
node server.js
```

2. **Access the application**:

Open a web browser and navigate to `http://localhost:4454` (or the port specified in `server.js`).

3. **Using the Simulation Interface**:

- **Fill out the form**: Enter the number of guys, guys' data, number of trees, trees' data, and number of generations.
- **Run Simulation**: Click on the "Run Simulation" button to initiate the simulation.
- **View Results**: Once the simulation completes, the results in both csv and graphical format will be displayed on the interface.

## Example Usage

To test the simulation:

1. Modify `input.txt` to adjust simulation parameters or create your own input file.
2. Run the simulation using the updated `input.txt`:

```markdown
./evolve < input.txt
```
3. Generate the population graph using `graphGens.py`:

```markdown
python graphGens.py
```

4. Observe the output and adjust parameters as needed for further testing or analysis.

## Output

The simulation outputs statistics for each generation, including:

- The number of surviving guys.
- The number of predators and prey.
- Average attributes such as size, speed, and food needed.
- Tree statistics including average height and number of fruits.

## Code Structure

- **evolve.cpp**: The main source file containing the implementation of the simulation.
- **test.txt**: A sample input file for testing the simulation.
- **people.txt**: Another sample input file with different initial conditions.
- **input.txt**: Input file written to from user interface
- **server.js**: Node.js server script that handles incoming requests, executes the C++ simulation, and serves the frontend files.
- **index.html**: HTML file providing the user interface for inputting simulation parameters.
- **script.js**: JavaScript file handling user input validation, sending data to the server, and displaying results.
- **styles.css**: Improves look of user interface
- **graphGens.py**: Python script to generate a stacked line graph of population dynamics over generations.
- **Makefile**: Compiles C++ code

## How It Works

1. **Initialization**: The simulation starts by reading input data for the initial population of guys and trees.
2. **Generation Cycle**:
   - **Food Gathering**: Guys try to eat from nearby trees, with bigger guys having priority.
   - **Predation**: Predators attempt to kill and eat smaller guys.
   - **Survival Check**: Guys who meet their food needs survive, while others die.
   - **Reproduction**: Surviving guys reproduce, creating the next generation with slightly mutated traits.
   - **Tree Reproduction**: Trees with sufficient fruits reproduce.
   - **Statistics**: Print statistics for the current generation.
3. **Repeat**: The process repeats for a specified number of generations.

## Scoring system

Final scores are shown and high score is maintained. The scoring system is as follows: 

```markdown
1000 * (Final # of guys) / ((Original # of guys)^(1/2) * (# of generations)^(1/3) * (Original # of food on trees))
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or create a pull request.


Enjoy exploring the world of evolving creatures and trees! 🌳🦁
