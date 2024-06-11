import matplotlib.pyplot as plt
import pandas as pd

# Read population data from CSV file
population_data = pd.read_csv('out.csv')

# Plot stacked line graph
plt.figure(figsize=(10, 6))
plt.plot(population_data['Generation'], population_data['Prey Population'], color='lightblue', label='Prey')
plt.plot(population_data['Generation'], population_data['Predator Population'], color='red', label='Predator')
plt.fill_between(population_data['Generation'], population_data['Prey Population'], population_data['Predator Population'], color='gray', alpha=0.5)
plt.xlabel('Generation')
plt.ylabel('Population')
plt.title('Population Dynamics over Generations')
plt.legend()
plt.grid(True)
plt.show()
