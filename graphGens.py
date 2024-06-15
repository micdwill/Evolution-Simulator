import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.ticker import MaxNLocator

# Read population data from CSV file
population_data = pd.read_csv('out.csv')

# Create the plot
plt.figure(figsize=(12, 8), dpi=100)  # Increased size and resolution

# Plot the Prey and Predator populations with enhanced colors and line widths
plt.plot(population_data['Generation'], population_data[' Prey Population'], color='#1f77b4', linewidth=2.5, label='Prey')  # Blue
plt.plot(population_data['Generation'], population_data[' Predator Population'], color='#d62728', linewidth=2.5, label='Predator')  # Red

# Fill the area between the Prey and Predator populations with a semi-transparent color
plt.fill_between(population_data['Generation'], population_data[' Prey Population'], population_data[' Predator Population'], color='lightcoral', alpha=0.3)

# Set labels and title with larger font sizes for better readability
plt.xlabel('Generation', fontsize=14)
plt.ylabel('Population', fontsize=14)
plt.title('', fontsize=16, weight='bold')

# Customize the legend
plt.legend(loc='upper right', fontsize=12, frameon=True, shadow=True, borderpad=1)

# Remove the grid lines and add a light background color
plt.grid(False)
plt.gca().set_facecolor('black')

# Set x-axis to have nice buckets and ensure only integer ticks
plt.gca().xaxis.set_major_locator(MaxNLocator(integer=True))

# Add a border and padding around the plot area
plt.gca().spines['top'].set_visible(False)
plt.gca().spines['right'].set_visible(False)
plt.gca().spines['left'].set_color('#cccccc')
plt.gca().spines['bottom'].set_color('#cccccc')
plt.gca().spines['left'].set_linewidth(1.5)
plt.gca().spines['bottom'].set_linewidth(1.5)
plt.gca().xaxis.label.set_color('#333333')
plt.gca().yaxis.label.set_color('#333333')

# Save the plot as an image file with a higher quality
plt.savefig('popDynamics.png', bbox_inches='tight', pad_inches=0.2)


