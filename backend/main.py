from typing import Union
import schemas
from datetime import date
from pydantic import BaseModel, ValidationError
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI

app = FastAPI()

origins = [
    "http://172.18.0.4:5173",  # substitua pela URL correta do seu frontend
    "http://localhost:5173",   # útil para desenvolvimento local também
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # ou use ["*"] para permitir tudo (não recomendado em produção)
    allow_credentials=True,
    allow_methods=["*"],                # permite todos os métodos (GET, POST, etc)
    allow_headers=["*"],                # permite todos os headers
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/weather")
def get_weather(lat: float, lon: float, event_date: date):
    weather = schemas.WeatherData(
    date=event_date,
    temp_avg_c=20.5,
    temp_max_c=25.0,
    temp_min_c=15.3,
    precipitation_mm=2.3,
    wind_speed_ms=3.2,
    wind_speed_max_ms=5.6,
    humidity_pct=70,
    specific_humidity_gkg=10.2,
    solar_radiation_kwh_m2=1.0,
    cloud_cover_pct=5.6
)
    return weather