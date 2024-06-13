#include <algorithm>
#include <cassert>
#include <deque>
#include <functional>
#include <iostream>
#include <iterator>
#include <limits>
#include <list>
#include <math.h>
#include <numeric>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <tuple>
#include <utility>
#include <vector>
#include <iomanip>
#include <getopt.h>
#include <unordered_set>
#include <random>
#include <fstream>

using namespace std;

// These are the creatures who evolve
struct Guy {
    double size;
    double speed;
    double foodNeeded;
    double location;
    double foodToNeed;
    bool predator;
    bool alive = false;
};

// Creatures get food from trees; trees also evolve
struct Tree {
    double height;
    double location;
    int fruitNum;
    int fruitHad;
};

struct PopulationData {
    size_t generation;
    size_t totalPopulation;
    size_t preyPopulation;
    size_t predatorPopulation;
};

// To find biggest guys from pointers to guys
struct CompareGuyPtrSize {
    bool operator()(const Guy* a, const Guy* b) const {
        return a->size > b->size;
    }
};

class Simulation {

private:
    // Store all guys and trees
    vector<Guy> guys;
    vector<Tree> trees;
    vector<PopulationData> populationHistory;
    size_t killCount = 0;
    int generations = 0;
    size_t genCount = 0;

    // To generate a normal distribution
    double generateNormal(double mean, double stddev) {
        random_device rd;
        mt19937 gen(rd());
        normal_distribution<double> dist(mean, stddev);
        return dist(gen);
    }

    // For reproduction after each generation
    void reproduce() {
        // Removes guys who didn't get enough food
        guys.erase(remove_if(guys.begin(), guys.end(),
        [](const Guy& guy) { return !guy.alive; }), guys.end());

        size_t num = guys.size();
    
        // All guys who live create 2 offsrping
        for (size_t i = 0; i < num; i++) {
        
            double newSize1 = generateNormal(guys[i].size, 0.5);
            double newSpeed1 = generateNormal(guys[i].speed, 0.5);
            double newFoodNeeded1 = generateNormal(guys[i].foodToNeed, 0.01);
            double newlocation1 = generateNormal(guys[i].location, 0.1);
            double pred1 = static_cast<double>(rand()) / RAND_MAX;
            // Chance of mutating into predator or prey
            bool predator1 = (pred1 > 0.995) ? !guys[i].predator : guys[i].predator;

            double newSize2 = generateNormal(guys[i].size, 0.5);
            double newSpeed2 = generateNormal(guys[i].speed, 0.5);
            double newFoodNeeded2 = generateNormal(guys[i].foodToNeed, 0.01);
            double newlocation2 = generateNormal(guys[i].location, 0.1);
            double pred2 = static_cast<double>(rand()) / RAND_MAX;
            bool predator2 = (pred2 > 0.995) ? !guys[i].predator : guys[i].predator;


            guys[i] = {newSize1, newSpeed1,
                       0.90*newFoodNeeded1 + 0.02*newSize1 + 0.02*newSpeed1, newlocation1,
                       0.90*newFoodNeeded1 + 0.02*newSize1 + 0.02*newSpeed1,
                       predator1, false};


            guys.push_back({newSize2, newSpeed2,
                            0.90*newFoodNeeded2 + 0.02*newSize2 + 0.02*newSpeed2,
                            newlocation2, 0.90*newFoodNeeded2 + 0.02*newSize2 + 0.02*newSpeed2,
                            predator2, false});
        }
        int sizeTree = trees.size();
        for (size_t i = 0; i < sizeTree; i++) {
            // If tree has fruit left it remains
            if (trees[i].fruitNum > 0) {
                // If tree has 3+ fruit left, chance of creating another tree
                if (trees[i].fruitNum > 2) {
                    addTree(trees[i]);
                }
                trees[i].fruitNum = trees[i].fruitHad;
                continue;
            }
            double pred = static_cast<double>(rand()) / RAND_MAX;
            // Even if tree has no fruit left, chance of remaining
            if (pred > 0.6) {
                trees[i].fruitNum = trees[i].fruitHad;
            }
        }
    }

    // To add new tree offspring
    void addTree(Tree& tree) {
        double pred = static_cast<double>(rand()) / RAND_MAX;
        if (pred < 0.1) {
            double newLoc = generateNormal(tree.location, 0.1);
            double newHeight = generateNormal(tree.height, 1);
            double newFrui = generateNormal(tree.fruitHad, 0.5);
            int newFruit = floor(newFrui);
            trees.push_back({newHeight, newLoc, newFruit, newFruit});
        }
    }

    // Check if guy is within range of a tree
    bool closeToTree(Guy &guy, Tree &tree) {
        return (guy.speed - abs(guy.location - tree.location) > 0);
    }

    // Allows guy to eat from tree if big enough
    void eat(Guy &guy, Tree &tree) {
        if (guy.size >= tree.height) {
            // Each guy capped at 4 fruits from a tree
            for (size_t i = 0; i < 4 && guy.foodNeeded > 0 && tree.fruitNum > 0; i++) {
                guy.foodNeeded -= 0.5;
                tree.fruitNum--;
            }
        }
    }
    
    // Predators try to kill a prey if they need more food
    void kill(size_t i) {
        for (size_t j = 1; j < guys.size(); j++) {
            if (guys[(i + j) % guys.size()].size < guys[i].size) {
                double probability = static_cast<double>(rand()) / RAND_MAX;
                // Low hunt success
                if (probability < 0.05) {
                    killCount++;
                    guys[i].foodNeeded -= 2.0;
                    guys[(i + j) % guys.size()].alive = false;
                    if (guys[i].foodNeeded <= 0) guys[i].alive = true;
                }
            }
        }
    }

    // For printing stats after each generation
    void stats() {
        genCount++;
        double avSize = 0;
        double avSpeed = 0;
        double avFood = 0;
        int fruitNum = 0;
        int predAmount = 0;
        int preyAmount = 0;
        double totAlive = 0;
        double avLoc = 0;
        double treeLoc = 0;
        double treeHeight;
        for (size_t i = 0; i < guys.size(); i++) {
            if (!guys[i].alive) continue;
            totAlive++;
            if (guys[i].predator) predAmount++;
            else preyAmount++;
            avSize += guys[i].size;
            avSpeed += guys[i].speed;
            avFood += guys[i].foodToNeed;
            avLoc += guys[i].location;
        }

        for (size_t i = 0; i < trees.size(); i++) {
            fruitNum += trees[i].fruitHad;
            treeLoc += trees[i].location;
            treeHeight += trees[i].height;
        }

        if (trees.size() > 0) {
            fruitNum /= trees.size();
            treeLoc /= trees.size();
            treeHeight /= trees.size();
        }

        if (totAlive > 0) {
            avSize /= totAlive;
            avSpeed /= totAlive;
            avFood /= totAlive;
            avLoc /= totAlive;
        }

        cout << "Amount of Guys who survived: " << totAlive << '\n';
        cout << "Amount of Predators who survived: " << predAmount << '\n';
        cout << "Amount of Prey who survived: " << preyAmount << '\n';
        cout << "Average size remaining: " << avSize << '\n';
        cout << "Average speed remaining: " << avSpeed << '\n';
        cout << "Average food needed remaining: " << avFood << '\n';
        cout << "Average guy location remaining: " << avLoc << '\n';
        cout << "Guys murdered: " << killCount << '\n';
        cout << "Amount of trees remaining: " << trees.size() << '\n';
        cout << "Average fruit per tree: " << fruitNum << '\n';
        cout << "Average tree location remaining: " << treeLoc << '\n';
        cout << "Average tree height remaining: " << treeHeight << '\n';

        collectPopulationData(genCount, static_cast<size_t>(totAlive),
        static_cast<size_t>(preyAmount), static_cast<size_t>(predAmount));

        if (totAlive == 0) {
            cout << "Population deceased\n";
            outputPopulationData("out.csv");
            exit(0);
        }

        cout << '\n';
    }

    // Function to output population data to a CSV file
    void outputPopulationData(const string& filename) {
        ofstream outputFile(filename);

        if (!outputFile) {
            cerr << "Error: Unable to open output file." << endl;
            return;
        }

        // Write header
        outputFile << "Generation, Total Population, Prey Population, Predator Population\n";

        // Write population data for each generation
        for (const auto& data : populationHistory) {
            outputFile << data.generation << ", " << data.totalPopulation << ", "
                       << data.preyPopulation << ", " << data.predatorPopulation << "\n";
        }

        outputFile.close();
        cout << "Population data has been written to " << filename << endl;
    }


public:

    // Take input
    void readInput() {
        int numGuys;
        cin >> numGuys;
        for (int i = 0; i < numGuys; i++) {
            Guy guy;
            cin >> guy.size >> guy.speed >> guy.foodNeeded >> guy.location >> guy.predator;
            guy.foodToNeed = guy.foodNeeded;
            guys.push_back(guy);
        }

        int numTrees;
        cin >> numTrees;
        for (int i = 0; i < numTrees; i++) {
            Tree tree;
            cin >> tree.height >> tree.location >> tree.fruitNum;
            tree.fruitHad = tree.fruitNum;
            trees.push_back(tree);
        }
    }

    // Go through a single generation
    void doGen() {
        
        for (Tree& tree : trees) {
            // Biggest guys get to eat from given tree first
            priority_queue<Guy*, vector<Guy*>, CompareGuyPtrSize> guysNearTree;

            for (Guy& guy : guys) {
                if (closeToTree(guy, tree) && guy.foodNeeded > 0) {
                    guysNearTree.push(&guy);
                }
            }

            // Guys try to eat until their full
            while (!guysNearTree.empty() && tree.fruitNum > 0) {
                eat(*guysNearTree.top(), tree);
                if (guysNearTree.top()->foodNeeded <= 0) {
                    guysNearTree.top()->alive = true;
                }
                guysNearTree.pop();
            }

        }

        // Predators try to kill if not enough food
        for (size_t i = 0; i < guys.size(); i++) {
            if (guys[i].predator) {
                double prob = static_cast<double>(rand()) / RAND_MAX;
            
                if (!guys[i].alive) {
                    kill(i);
                }
            // Prey try to get help from other prey, higher chance of success than hunts
            } else {
                double prob = static_cast<double>(rand()) / RAND_MAX;
                if (prob > 0.5) {
                    guys[i].alive = true;
                }
            }
        }
        // Print stats and reproduce
        stats();
        reproduce();
    }

    void doSim() {
        cin >> generations;
        for (size_t i = 0; i < generations; i++) {
            cout << "Generation " << i + 1 << ":\n";
            doGen();
        }
        outputPopulationData("out.csv");
    }

    void collectPopulationData(size_t generation, size_t total,
                               size_t prey, size_t predator) {
        populationHistory.push_back({generation, total, prey, predator});
    }


};

int main() {

    Simulation sim;

    sim.readInput();

    sim.doSim();

    return 1;
}