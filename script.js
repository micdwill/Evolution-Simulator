
function runSimulation() {
    const numGuys = document.getElementById('numGuys').value;
    const guysData = document.getElementById('guysData').value;
    const numTrees = document.getElementById('numTrees').value;
    const treesData = document.getElementById('treesData').value;
    const numGenerations = document.getElementById('numGenerations').value;

    // Convert input values to numbers
    const numGuysInt = parseInt(numGuys);
    const numTreesInt = parseInt(numTrees);
    const numGenerationsInt = parseInt(numGenerations);

    // Split data inputs into arrays
    const guysDataArray = guysData.trim().split(/\s+/); // Split by any whitespace
    const treesDataArray = treesData.trim().split(/\s+/); // Split by any whitespace

    // Validate inputs before sending to the server
    if (!Number.isInteger(numGuysInt) || numGuysInt <= 0) {
        alert('Number of Creatures must be a positive integer.');
        return;
    }//

    if (!Number.isInteger(numTreesInt) || numTreesInt <= 0) {
        alert('Number of Trees must be a positive integer.');
        return;
    }

    if (!Number.isInteger(numGenerationsInt) || numGenerationsInt <= 0) {
        alert('Number of Generations must be a positive integer.');
        return;
    }//

    if (guysDataArray.length !== numGuysInt * 5) {
        alert(`Creatures Data must contain stats for all creatures (${numGuysInt * 5} numerical values). Use spaces or new lines rather than commas.`);
        return;
    }

    if (treesDataArray.length !== numTreesInt * 3) {
        alert(`Trees Data must contain stats for all trees (${numTreesInt * 3} numerical values). Use spaces or new lines rather than commas.`);
        return;
    }

    // Ensure all values in treesDataArray are numbers and are 1 or greater
    if (!treesDataArray.every(value => !isNaN(value) && Number(value) >= 1)) {
      alert('Trees Data must only contain numerical values of 1 or greater.');
      return;
    }

    // Ensure all values in guysData and treesData are numbers
    if (!guysDataArray.every(value => !isNaN(value)) || !treesDataArray.every(value => !isNaN(value))) {
        alert('Creatures data and Trees data must only contain numerical values.');
        return;
    }
  
    //fetch('http://localhost:4456/runSimulation', {
    fetch('https://fast-reaches-37987-bde7d538d636.herokuapp.com/runSimulation', {
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
      return response.json(); // Assuming server returns the data and high score as JSON
    })
    .then(({ data, highScore }) => {
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
  
      // Display the final score and high score
      const finalScore = parseFloat(lines[lines.length - 1].split(',').pop().trim());
      const scoreDiv = document.createElement('div');
      scoreDiv.innerHTML = `
        <p>Final Score: ${finalScore.toFixed(2)}</p>
        <p>High Score: ${highScore.toFixed(2)}</p>
      `;
      outputDiv.appendChild(scoreDiv);

      // Update the graph image with cache busting
      const graphImg = document.getElementById('graphImg');
      const timestamp = new Date().getTime(); // Use the current timestamp
      graphImg.src = `popDynamics.png?t=${timestamp}`;

      // Find the scoreSection and append the scoreDiv to it
      const scoreSection = document.getElementById('scoreSection');
      if (scoreSection) {
      // Clear any previous scores
      scoreSection.innerHTML = '';

      // Add the new scores
      scoreSection.appendChild(scoreDiv);
      } else {
        console.error('No element with id "scoreSection" found.');
      }
    })
    .catch(error => {
      //console.error('Error running simulation:', error);
      //alert('Error running simulation. Please check the console for details.');
    });
  }
  