from Nasa_Power_data_extractor import NASAWeatherExtractor
from datetime import datetime, timedelta


def known_data(latitude, longitude, date, days):
    extractor = NASAWeatherExtractor(latitude, longitude)
    df, stats = extractor.run(date, days, export_csv=False, export_json=False)
    #print(df)
    #print(stats)


def prediction_data(latitude, longitude, date, days):
    extractor = NASAWeatherExtractor(latitude, longitude)

    date_1y = date - timedelta(days=365)
    df1,stats1 = extractor.run(date_1y, days, export_csv=False, export_json=False)
    
    date_2y = date - timedelta(days=730)
    df2,stats2 = extractor.run(date_2y, days, export_csv=False, export_json=False)
    
    date_3y = date - timedelta(days=1095)
    df3,stats3 = extractor.run(date_3y, days, export_csv=False, export_json=False)
    
    print('stats1:',stats1)
    print('stats2:',stats2)
    print('stats3:',stats3)

    return


if __name__ == "__main__":
    # Example coordinates (Patos de Minas, MG, Brazil)
    latitude = -18.5788
    longitude = -46.5182
    
    # Example date
    date = datetime.strptime("2023-10-15", "%Y-%m-%d")
    
    # Number of days to extract
    days = 90
    
    #known_data(latitude, longitude, date, days)
    prediction_data(latitude, longitude, date, days)