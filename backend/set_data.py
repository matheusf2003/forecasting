import json
import os
from Nasa_Power_data_extractor import NASAWeatherExtractor
from datetime import datetime, timedelta
import pandas as pd
import matplotlib.pyplot as plt


def known_data(latitude, longitude, date, days):
    extractor = NASAWeatherExtractor(latitude, longitude)
    df, stats = extractor.run(date, days, export_csv=True, export_json=False)
    df, stats = extractor.run(date, 0, export_csv=False, export_json=True)
    #print(df)
    #print(stats)
    return df, stats


def prediction_data(latitude, longitude, date, days):
    extractor = NASAWeatherExtractor(latitude, longitude)

    month = date.month
    day = date.day

    # Extract data for the same period over the past 3 years
    date_1y = datetime.strptime(f'2024-{month}-{day}', "%Y-%m-%d")
    df1, stats1 = extractor.run(date_1y, days, export_csv=False, export_json=False)

    date_2y = datetime.strptime(f'2023-{month}-{day}', "%Y-%m-%d")
    df2, stats2 = extractor.run(date_2y, days, export_csv=False, export_json=False)

    date_3y = datetime.strptime(f'2022-{month}-{day}', "%Y-%m-%d")
    df3, stats3 = extractor.run(date_3y, days, export_csv=False, export_json=False)
    
    date_4y = datetime.strptime(f'2021-{month}-{day}', "%Y-%m-%d")
    df4, stats4 = extractor.run(date_4y, days, export_csv=False, export_json=False)
    
    date_5y = datetime.strptime(f'2020-{month}-{day}', "%Y-%m-%d")
    df5, stats5 = extractor.run(date_5y, days, export_csv=False, export_json=False)

    # Check if all DataFrames were obtained successfully
    if not all([df1 is not None, df2 is not None, df3 is not None, df4 is not None, df5 is not None]):
        print("Error: not all data was obtained successfully.")
        return None, None

    # Combine all DataFrames
    combined_df = pd.concat([df1, df2, df3, df4, df5])

    # Calculate averages and aggregated values
    avg_stats = {
        "period": {
            "start": combined_df.index.min().strftime('%Y-%m-%d'),
            "end": combined_df.index.max().strftime('%Y-%m-%d'),
            "days": len(combined_df)
        },
        "temperature": {
            "avg_mean": round(combined_df["temp_avg_c"].mean(), 2),
            "avg_max": round(combined_df["temp_max_c"].mean(), 2),
            "avg_min": round(combined_df["temp_min_c"].mean(), 2),
            "absolute_max": round(combined_df["temp_max_c"].max(), 2),
            "absolute_min": round(combined_df["temp_min_c"].min(), 2),
            "days_above_35c": int((combined_df["temp_max_c"] > 35).sum()),
            "days_below_0c": int((combined_df["temp_min_c"] < 0).sum())
        },
        "precipitation": {
            "total_mm": round(combined_df["precipitation_mm"].sum(), 2),
            "avg_daily_mm": round(combined_df["precipitation_mm"].mean(), 2),
            "max_daily_mm": round(combined_df["precipitation_mm"].max(), 2),
            "rainy_days": int((combined_df["precipitation_mm"] > 1).sum()),
            "heavy_rain_days": int((combined_df["precipitation_mm"] > 10).sum())
        },
        "wind": {
            "avg_speed_ms": round(combined_df["wind_speed_ms"].mean(), 2),
            "max_speed_ms": round(combined_df["wind_speed_max_ms"].max(), 2),
            "windy_days": int((combined_df["wind_speed_max_ms"] > 10).sum()),
            "very_windy_days": int((combined_df["wind_speed_max_ms"] > 15).sum())
        },
        "humidity": {
            "avg_pct": round(combined_df["humidity_pct"].mean(), 2),
            "max_pct": round(combined_df["humidity_pct"].max(), 2),
            "min_pct": round(combined_df["humidity_pct"].min(), 2),
            "uncomfortable_days": int(
                ((combined_df["humidity_pct"] > 70) & (combined_df["temp_avg_c"] > 25)).sum()
            )
        },
        "solar_cloud": {
            "avg_solar_kwh_m2": round(combined_df["solar_radiation_kwh_m2"].mean(), 2),
            "avg_cloud_cover_pct": round(combined_df["cloud_cover_pct"].mean(), 2),
            "cloudy_days": int((combined_df["cloud_cover_pct"] > 70).sum())
        }
    }

    # Display results
    print("\n")
    print("="*30)
    print(" Average Weather Statistics over 3 Years")
    print("="*30)
    print(json.dumps(avg_stats, indent=2, ensure_ascii=False))

    # Salva em arquivo JSON
    with open("historic_weather_stats.json", "w", encoding="utf-8") as f:
        json.dump(avg_stats, f, indent=2, ensure_ascii=False)
    print("\nFile 'historic_weather_stats.json' succeeded!")

    return avg_stats, combined_df

def plot_weather_data(csv_file, output_dir):
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
    # Example coordinates (Patos de Minas, MG, Brazil)
    latitude = -18.5788
    longitude = -46.5182
    
    # Example date
    date = datetime.strptime("2023-10-15", "%Y-%m-%d")
    
    # Number of days to extract
    days = 90
    
    known_data(latitude, longitude, date, days)
    plot_weather_data("weather_data.csv", "graphs")
    
    prediction_data(latitude, longitude, date, days)
    