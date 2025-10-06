from typing import Union
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import os

from set_data import known_data, prediction_data, plot_weather_data

app = FastAPI()

origins = [
    "http://172.18.0.3:5173",
    "http://172.18.0.4:5173",  # substitua pela URL correta do seu frontend
    "http://localhost:5173",   # útil para desenvolvimento local também
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta a pasta de gráficos como arquivos estáticos
graphs_folder = "graphs"
os.makedirs(graphs_folder, exist_ok=True)
app.mount("/graphs", StaticFiles(directory=graphs_folder), name="graphs")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/weather")
def get_weather(lat: float, lon: float, event_date: date):
    limiar_date = date(2025, 10, 1)

    if event_date > limiar_date:
        prediction_data(lat, lon, event_date, days=15)
        return FileResponse("historic_weather_stats.json", media_type="application/json")
    else:
        known_data(lat, lon, event_date, days=15)
        plot_weather_data("weather_data.csv", graphs_folder)
        return FileResponse("weather_stats.json", media_type="application/json")
