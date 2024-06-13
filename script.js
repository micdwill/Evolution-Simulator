function runSimulation() {
    const numGuys = document.getElementById('numGuys').value;
    const guysData = document.getElementById('guysData').value;
    const numTrees = document.getElementById('numTrees').value;
    const treesData = document.getElementById('treesData').value;
    const numGenerations = document.getElementById('numGenerations').value;
  
    fetch('http://localhost:4456/runSimulation', { // Updated URL here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numGuys,
        guysData,
        numTrees,
        treesData,
        numGenerations
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Assuming server returns the CSV content as plain text
    })
    .then(data => {
      // Clear previous results
      const outputDiv = document.getElementById('simulationOutput');
      outputDiv.innerHTML = '';
  
      // Split data into lines
      const lines = data.trim().split('\n');
  
      // Create table element
      const table = document.createElement('table');
      table.classList.add('simulationTable');
  
      // Create table header row
      const headerRow = document.createElement('tr');
      const headers = lines[0].split(',');
      headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText.trim();
        headerRow.appendChild(headerCell);
      });
      table.appendChild(headerRow);
  
      // Create table body rows
      for (let i = 1; i < lines.length; i++) {
        const row = document.createElement('tr');
        const cells = lines[i].split(',');
        cells.forEach(cellText => {
          const cell = document.createElement('td');
          cell.textContent = cellText.trim();
          row.appendChild(cell);
        });
        table.appendChild(row);
      }
  
      // Append table to output div
      outputDiv.appendChild(table);
    })
    .catch(error => {
      console.error('Error running simulation:', error);
      alert('Error running simulation. Please check the console for details.');
    });
  }
  