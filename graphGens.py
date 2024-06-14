import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.ticker import MaxNLocator

# Read population data from CSV file
population_data = pd.read_csv('out.csv')

# Create the plot
plt.figure(figsize=(10, 6))

# Plot the Prey and Predator populations
plt.plot(population_data['Generation'], population_data[' Prey Population'], color='lightblue', label='Prey')
plt.plot(population_data['Generation'], population_data[' Predator Population'], color='red', label='Predator')

# Fill the area between the Prey and Predator populations
plt.fill_between(population_data['Generation'], population_data[' Prey Population'], population_data[' Predator Population'], color='gray', alpha=0.5)

# Set labels and title
plt.xlabel('Generation')
plt.ylabel('Population')
plt.title('Population Dynamics over Generations')

# Add legend and grid
plt.legend()
plt.grid(True)

# Set x-axis to have nice buckets
plt.gca().xaxis.set_major_locator(MaxNLocator(integer=True)) # Only show integer ticks if applicable
# Alternatively, specify the number of ticks you want:
# plt.gca().xaxis.set_major_locator(MaxNLocator(nbins=10))

# Show the plot
plt.show()

