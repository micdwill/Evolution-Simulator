function runSimulation() {
    const numGuys = document.getElementById('numGuys').value.trim();
    const guysData = document.getElementById('guysData').value.trim();
    const numTrees = document.getElementById('numTrees').value.trim();
    const treesData = document.getElementById('treesData').value.trim();
    const numGenerations = document.getElementById('numGenerations').value.trim();
  
    // Validate input (basic example)
    if (!numGuys || !guysData || !numTrees || !treesData || !numGenerations) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Prepare data to send to server
    const simulationData = {
      numGuys,
      guysData,
      numTrees,
      treesData,
      numGenerations
    };
  
    // Send POST request to server
    fetch('http://localhost:4456/runSimulation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Assuming server returns the CSV content as plain text
    })
    .then(data => {
      console.log('Simulation completed successfully:', data);
      // Update UI or handle response data here
      document.getElementById('simulationOutput').textContent = data;
    })
    .catch(error => {
      console.error('Error running simulation:', error);
      alert('Error running simulation. Please check the console for details.');
    });
  }
  