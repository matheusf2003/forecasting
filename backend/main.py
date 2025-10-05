from typing import Union
import schemas
from datetime import date
from pydantic import BaseModel, ValidationError
from fastapi.middleware.cors import CORSMiddleware
from set_data import known_data, prediction_data

from fastapi.responses import FileResponse
from datetime import datetime, timedelta

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
def get_weather(lat: float, lon: float, event_date: date, days: int):
    limiar_date = date(2025, 10, 1)
            
    if event_date > limiar_date:
        prediction_data(lat, lon, event_date, days)
        return FileResponse("historic_weather_stats.json", media_type="application/json")
    else:
        known_data(lat, lon, event_date, days)
        return FileResponse("weather_stats.json", media_type="application/json")
