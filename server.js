const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // If using CORS middleware
const app = express();
const port = 4456;

console.log('Server is starting...');

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware if needed
app.use(cors());

// Serve static files (e.g., index.html, script.js)
app.use(express.static('public'));

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

  // Write input data to input.txt
  const inputFilePath = path.join(__dirname, 'input.txt');
  const inputContent = `${numGuys}\n${guysData}\n${numTrees}\n${treesData}\n${numGenerations}`;
  
  fs.writeFile(inputFilePath, inputContent, (err) => {
    if (err) {
      console.error(`Error writing input file: ${err}`);
      return res.status(500).send('Error preparing simulation input');
    }

    console.log('Input file written successfully:', inputFilePath);

    // Construct command to execute simulation
    const command = `./evolve < ${inputFilePath}`;
    console.log('Executing command:', command);

    // Execute simulation process
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing simulation: ${error}`);
        return res.status(500).send('Simulation failed');
      }

      console.log('Simulation standard output:', stdout);
      console.error('Simulation standard error:', stderr);

      // Read simulation results from file (out.csv)
      const resultFilePath = path.join(__dirname, 'out.csv');
      console.log('Looking for result file at:', resultFilePath);

      fs.readFile(resultFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading simulation results: ${err}`);
          return res.status(500).send('Simulation result not found');
        }
        console.log('Simulation results:', data);
        res.send(data); // Send simulation results back to client
      });
    });
  });
});

// Example: Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
