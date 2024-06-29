const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 4456;

console.log('Server is starting...');

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware if needed
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


let highScore = 0; // Variable to store the high score

// Example route to handle simulation request
app.post('/runSimulation', (req, res) => {
  console.log('Received a request to /runSimulation');
  
  const { numGuys, guysData, numTrees, treesData, numGenerations } = req.body;
  console.log('Request body:', req.body);

  // Validate input
  if (!numGuys || !guysData || !numTrees || !treesData || !numGenerations) {
    console.log('Missing required fields');
    return res.status(400).send('Missing required fields');
  }

  // Validate input
    // Check if the number of guys, trees, and generations are integers
    if (!Number.isInteger(Number(numGuys)) || !Number.isInteger(Number(numTrees)) || !Number.isInteger(Number(numGenerations))) {
        console.log('The number of guys, trees, and generations must be integers.');
        return res.status(400).send('The number of guys, trees, and generations must be integers.');
    }

    // Check if guysData and treesData have the correct number of numerical values
    const guysDataArray = guysData.trim().split(/\s+/); // Split by any whitespace
    const treesDataArray = treesData.trim().split(/\s+/); 

    if (guysDataArray.length !== numGuys * 5) {
        console.log(`Guys data must contain exactly ${numGuys * 5} numerical values.`);
        return res.status(400).send(`Guys data must contain exactly ${numGuys * 5} numerical values.`);
    }

    if (treesDataArray.length !== numTrees * 3) {
        console.log(`Trees data must contain exactly ${numTrees * 3} numerical values.`);
        return res.status(400).send(`Trees data must contain exactly ${numTrees * 3} numerical values.`);
    }

    // Ensure all values in guysData and treesData are numbers
    if (!guysDataArray.every(value => !isNaN(value)) || !treesDataArray.every(value => !isNaN(value))) {
        console.log('Guys data and trees data must only contain numbers.');
        return res.status(400).send('Guys data and trees data must only contain numbers.');
    }

    // Write input data to input.txt
    const inputFilePath = path.join(__dirname, 'input.txt');
    const inputContent = `${numGuys}\n${guysData}\n${numTrees}\n${treesData}\n${numGenerations}`;
  
    fs.writeFile(inputFilePath, inputContent, (err) => {
        if (err) {
          console.error(`Error writing input file: ${err}`);
         return res.status(500).send('Error preparing simulation input');
        }

        console.log('Input file written successfully:', inputFilePath);

        fs.readFile('/app/input.txt', 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading input file: ${err}`);
            return;
          }

        // Construct command to execute simulation
        const command = `./evolve < input.txt`;
        //const command = `./evolve < ${inputFilePath}`;
        console.log('Executing command:', command);

        // Execute simulation process
        exec('./evolve', [], { input: data }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing simulation: ${error}`);
            return res.status(500).send(`Error executing simulation: ${error}`);
        }

      console.log('Simulation standard output:', stdout);
      console.error('Simulation standard error:', stderr);

      // Generate the graph
      exec('python3 graphGens.py', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error generating graph: ${error}`);
          return res.status(500).send(`Error generating graph: ${error}`);
        }
//
      // Read simulation results from file (out.csv)
      const resultFilePath = path.join(__dirname, 'out.csv');
      console.log('Looking for result file at:', resultFilePath);

      fs.readFile(resultFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading simulation results: ${err}`);
          return res.status(500).send('Simulation result not found');
        }
        console.log('Simulation results:', data);

        // Extract the final score from the last line of out.csv
        const lines = data.trim().split('\n');
        const finalScoreLine = lines[lines.length - 1];
        const finalScore = parseFloat(finalScoreLine.split(',').pop().trim());
        console.log('Final Score:', finalScore);

        // Update high score if the final score is higher
        if (finalScore > highScore) {
          highScore = finalScore;
          console.log('New high score:', highScore);
        }

        // Send both the simulation data and the high score back to the client
        res.json({ data, highScore }); // Sending JSON with simulation results and high score
      });
    });
  });
});
});
});

// Example: Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

