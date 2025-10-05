from pydantic import BaseModel
from datetime import date


class WeatherData(BaseModel):
    date: date
    temp_avg_c: float
    temp_max_c: float
    temp_min_c: float
    precipitation_mm: float
    wind_speed_ms: float
    wind_speed_max_ms: float
    humidity_pct: float
    specific_humidity_gkg: float
    solar_radiation_kwh_m2: float
    cloud_cover_pct: float

