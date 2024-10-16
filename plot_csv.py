import sys
import pandas as pd
import matplotlib.pyplot as plt

def plot_csv(file_path):
    # Read the CSV file
    df = pd.read_csv(file_path, header=1)

    # Example plot: Plotting the first two columns
    plt.figure(figsize=(10, 6))
    plt.plot(df.iloc[:, 0], df.iloc[:, 1], marker='o')
    plt.title('Example Plot')
    plt.xlabel('X-axis Label')
    plt.ylabel('Y-axis Label')
    plt.grid(True)
    plt.savefig('plot.png')  # Save the plot as an image file

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python plot_csv.py <csv_file_path>")
        sys.exit(1)

    csv_file_path = sys.argv[1]
    plot_csv(csv_file_path)