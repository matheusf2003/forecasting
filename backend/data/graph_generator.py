import pandas as pd
import matplotlib.pyplot as plt
import os


def plot_weather_data(csv_file="weather_data.csv", output_dir="graphs"):
    # Load data
    df = pd.read_csv(csv_file, parse_dates=["date"])
    df.set_index("date", inplace=True)

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Plot each variable separately
    for column in df.columns:
        plt.figure(figsize=(10, 5))
        plt.plot(df.index, df[column], marker="o", linestyle="-", label=column)
        plt.title(f"{column.replace('_', ' ').title()} over Time")
        plt.xlabel("Date")
        plt.ylabel(column.replace("_", " ").title())
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.tight_layout()

        # Save figure
        filename = f"{output_dir}/{column}.png"
        plt.savefig(filename)
        plt.close()
        print(f"Saved: {filename}")

    print(f"\nAll plots saved in '{output_dir}' directory.")

if __name__ == "__main__":
    plot_weather_data("weather_data.csv")

