import requests
import pandas as pd
from datetime import datetime, timedelta
import json

class NASAWeatherExtractor:
    """
    Extract weather data from NASA POWER API for a specific location
    """
    
    def __init__(self, latitude, longitude):
        """
        Initialize extractor with coordinates
        
        Args:
            latitude (float): Latitude (-90 to 90)
            longitude (float): Longitude (-180 to 180)
        """
        self.latitude = latitude
        self.longitude = longitude
        self.base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        
    def get_date_range(self, date):
        """
        Calculate date range for the past N months
        
        Args:
            months_back (int): Number of months to look back
            
        Returns:
            tuple: (start_date, end_date) in YYYYMMDD format
        """
        end_date = date + timedelta(days=15) 
        #print(f"End date set to: {end_date.strftime('%Y-%m-%d')}")
        start_date = date - timedelta(days=15)
        #print(f"Start date set to: {start_date.strftime('%Y-%m-%d')}")
        
        return start_date.strftime("%Y%m%d"), end_date.strftime("%Y%m%d")
    
    def fetch_weather_data(self, date):
        """
        Fetch weather data from NASA POWER API
        
        Args:
            months_back (int): Number of months to retrieve
            
        Returns:
            dict: Raw API response
        """
        start_date, end_date = self.get_date_range(date)
        
        # Core weather variables
        weather_variables = [
            'T2M',          # Temperature at 2m (°C)
            'T2M_MAX',      # Maximum Temperature (°C)
            'T2M_MIN',      # Minimum Temperature (°C)
            'PRECTOTCORR',  # Precipitation Corrected (mm/day)
            'WS10M',        # Wind Speed at 10m (m/s)
            'WS10M_MAX',    # Maximum Wind Speed (m/s)
            'RH2M',         # Relative Humidity at 2m (%)
            'QV2M',         # Specific Humidity at 2m (g/kg)
            'ALLSKY_SFC_SW_DWN',  # Solar Radiation (kW-hr/m^2/day)
            'CLOUD_AMT'     # Cloud Amount (%)
        ]
        
        params = {
            'parameters': ','.join(weather_variables),
            'community': 'RE',  # Renewable Energy community
            'longitude': self.longitude,
            'latitude': self.latitude,
            'start': start_date,
            'end': end_date,
            'format': 'JSON'
        }
        
        print(f"Fetching data for coordinates: ({self.latitude}, {self.longitude})")
        #print(f"Date range: {start_date} to {end_date}")
        
        try:
            response = requests.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return None
    
    def process_to_dataframe(self, raw_data):
        """
        Convert raw API response to pandas DataFrame
        
        Args:
            raw_data (dict): Raw API response
            
        Returns:
            pd.DataFrame: Processed weather data
        """
        if not raw_data or 'properties' not in raw_data:
            print("No valid data received")
            return None
        
        # Extract parameter data
        parameters = raw_data['properties']['parameter']
        
        # Create DataFrame
        df_dict = {}
        for param, values in parameters.items():
            df_dict[param] = values
        
        df = pd.DataFrame(df_dict)
        
        # Convert index to datetime
        df.index = pd.to_datetime(df.index, format='%Y%m%d')
        df.index.name = 'date'
        
        # Replace fill values (-999) with NaN
        df = df.replace(-999, pd.NA)
        
        # Rename columns for clarity
        column_names = {
            'T2M': 'temp_avg_c',
            'T2M_MAX': 'temp_max_c',
            'T2M_MIN': 'temp_min_c',
            'PRECTOTCORR': 'precipitation_mm',
            'WS10M': 'wind_speed_ms',
            'WS10M_MAX': 'wind_speed_max_ms',
            'RH2M': 'humidity_pct',
            'QV2M': 'specific_humidity_gkg',
            'ALLSKY_SFC_SW_DWN': 'solar_radiation_kwh_m2',
            'CLOUD_AMT': 'cloud_cover_pct'
        }
        
        df = df.rename(columns=column_names)
        
        return df
    
    def calculate_statistics(self, df):
        """
        Calculate weather statistics
        
        Args:
            df (pd.DataFrame): Weather data
            
        Returns:
            dict: Statistical summaries
        """
        if df is None or df.empty:
            return None
        
        stats = {
            'period': {
                'start': df.index.min().strftime('%Y-%m-%d'),
                'end': df.index.max().strftime('%Y-%m-%d'),
                'days': len(df)
            },
            'temperature': {
                'avg_mean': round(df['temp_avg_c'].mean(), 2),
                'avg_max': round(df['temp_max_c'].mean(), 2),
                'avg_min': round(df['temp_min_c'].mean(), 2),
                'absolute_max': round(df['temp_max_c'].max(), 2),
                'absolute_min': round(df['temp_min_c'].min(), 2),
                'days_above_35c': int((df['temp_max_c'] > 35).sum()),
                'days_below_0c': int((df['temp_min_c'] < 0).sum())
            },
            'precipitation': {
                'total_mm': round(df['precipitation_mm'].sum(), 2),
                'avg_daily_mm': round(df['precipitation_mm'].mean(), 2),
                'max_daily_mm': round(df['precipitation_mm'].max(), 2),
                'rainy_days': int((df['precipitation_mm'] > 1).sum()),
                'heavy_rain_days': int((df['precipitation_mm'] > 10).sum())
            },
            'wind': {
                'avg_speed_ms': round(df['wind_speed_ms'].mean(), 2),
                'max_speed_ms': round(df['wind_speed_max_ms'].max(), 2),
                'windy_days': int((df['wind_speed_max_ms'] > 10).sum()),  # >36 km/h
                'very_windy_days': int((df['wind_speed_max_ms'] > 15).sum())  # >54 km/h
            },
            'humidity': {
                'avg_pct': round(df['humidity_pct'].mean(), 2),
                'max_pct': round(df['humidity_pct'].max(), 2),
                'min_pct': round(df['humidity_pct'].min(), 2),
                'uncomfortable_days': int(((df['humidity_pct'] > 70) & (df['temp_avg_c'] > 25)).sum())
            },
            'solar_cloud': {
                'avg_solar_kwh_m2': round(df['solar_radiation_kwh_m2'].mean(), 2),
                'avg_cloud_cover_pct': round(df['cloud_cover_pct'].mean(), 2),
                'cloudy_days': int((df['cloud_cover_pct'] > 70).sum())
            }
        }
        
        return stats
    
    def export_to_csv(self, df, filename='weather_data.csv'):
        """
        Export data to CSV file
        
        Args:
            df (pd.DataFrame): Weather data
            filename (str): Output filename
        """
        if df is not None:
            df.to_csv(filename)
            print(f"\nData exported to: {filename}")
    
    def export_to_json(self, stats, filename='weather_stats.json'):
        """
        Export statistics to JSON file
        
        Args:
            stats (dict): Statistics
            filename (str): Output filename
        """
        if stats is not None:
            with open(filename, 'w') as f:
                json.dump(stats, f, indent=2)
            print(f"Statistics exported to: {filename}")
    
    def run(self, date, export_csv=True, export_json=True):
        """
        Run complete extraction pipeline
        
        Args:
            export_csv (bool): Export raw data to CSV
            export_json (bool): Export statistics to JSON
            
        Returns:
            tuple: (DataFrame, statistics dict)
        """
        print("=" * 60)
        print("NASA POWER Weather Data Extractor")
        print("=" * 60)
        
        # Fetch data
        raw_data = self.fetch_weather_data(date)
        if raw_data is None:
            return None, None
        
        # Process to DataFrame
        df = self.process_to_dataframe(raw_data)
        if df is None:
            return None, None
        
        print(f"\nSuccessfully retrieved {len(df)} days of data")
        
        # Calculate statistics
        stats = self.calculate_statistics(df)
        
        # Display summary
        self.print_summary(stats)
        
        # Export files
        if export_csv:
            self.export_to_csv(df)
        
        if export_json:
            self.export_to_json(stats)
        
        return df, stats
    
    def print_summary(self, stats):
        """
        Print formatted statistics summary
        
        Args:
            stats (dict): Statistics dictionary
        """
        if stats is None:
            return
        
        print("\n" + "=" * 60)
        print("WEATHER SUMMARY")
        print("=" * 60)
        
        print(f"\nPeriod: {stats['period']['start']} to {stats['period']['end']}")
        print(f"   Total days: {stats['period']['days']}")
        
        print(f"\nTemperature:")
        print(f"   Average: {stats['temperature']['avg_mean']}°C")
        print(f"   Range: {stats['temperature']['absolute_min']}°C to {stats['temperature']['absolute_max']}°C")
        print(f"   Hot days (>35°C): {stats['temperature']['days_above_35c']}")
        print(f"   Cold days (<0°C): {stats['temperature']['days_below_0c']}")
        
        print(f"\nPrecipitation:")
        print(f"   Total: {stats['precipitation']['total_mm']} mm")
        print(f"   Average daily: {stats['precipitation']['avg_daily_mm']} mm")
        print(f"   Rainy days: {stats['precipitation']['rainy_days']}")
        print(f"   Heavy rain days (>10mm): {stats['precipitation']['heavy_rain_days']}")
        
        print(f"\nWind:")
        print(f"   Average speed: {stats['wind']['avg_speed_ms']} m/s")
        print(f"   Maximum speed: {stats['wind']['max_speed_ms']} m/s")
        print(f"   Windy days (>10 m/s): {stats['wind']['windy_days']}")
        
        print(f"\nHumidity:")
        print(f"   Average: {stats['humidity']['avg_pct']}%")
        print(f"   Uncomfortable days: {stats['humidity']['uncomfortable_days']}")
        
        print("\n" + "=" * 60)


# Example usage
def main():
    # Example coordinates (Patos de Minas, MG, Brazil)
    latitude = -18.5788
    longitude = -46.5182
    
    # Create extractor instance
    extractor = NASAWeatherExtractor(latitude, longitude)
    
    # Run extraction for the past month
    date =  "2023-10-15"
    date = datetime.strptime(date, "%Y-%m-%d")
    df, stats = extractor.run(date, export_csv=True, export_json=True)
    
    # Display first few rows
    if df is not None:
        print("\nFirst 5 days of data:")
        print(df.head())
        
        print("\nData shape:", df.shape)
        print("\nColumn names:", df.columns.tolist())
        
if __name__ == "__main__":
    main()