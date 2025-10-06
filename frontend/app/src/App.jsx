import { useState } from 'react';
import MapPicker from './components/Map/MapPicker';
import Graph from './Graph.jsx'; // Importa o Graph
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Novo estado para controlar se o Graph deve aparecer
  const [showGraph, setShowGraph] = useState(false);
  // Novo estado para forçar atualização do Graph
  const [graphKey, setGraphKey] = useState(0);

  const handleMapSelect = (coords) => {
    setSelectedCoords(coords);
  };

  const handleSearch = async () => {
    if (!selectedCoords || !selectedDate) {
      alert("Por favor, selecione um local no mapa e uma data.");
      return;
    }

    setIsLoading(true);
    setWeatherData(null);

    const backendUrl = new URL('http://localhost:5001/weather');
    backendUrl.searchParams.append('lat', selectedCoords.lat);
    backendUrl.searchParams.append('lon', selectedCoords.lng);
    backendUrl.searchParams.append('event_date', selectedDate);

    try {
      const response = await fetch(backendUrl);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setWeatherData(data);
      console.log("Dados recebidos:", data);
      const html = await createWeatherTable(data);
      document.getElementById('table-container').innerHTML = html;


    } catch (err) {
      console.error("Falha ao buscar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função chamada ao clicar em "Generate Graphs"
  const handleGenerateGraphs = () => {
    setShowGraph(true); // Exibe o Graph
    setGraphKey(prev => prev + 1); // Atualiza o Graph a cada clique
  };

  async function createWeatherTable(jsonData) {

      const labels = {
          period: { name: "📅 Período", props: { start: "Data de Início", end: "Data de Fim", days: "Total de Dias" }, units: { days: " dias" } },
          temperature: { name: "🌡️ Temperatura", props: { avg_mean: "Média", avg_max: "Máxima Média", avg_min: "Mínima Média", absolute_max: "Máxima Absoluta", absolute_min: "Mínima Absoluta", days_above_35c: "Dias acima de 35°C", days_below_0c: "Dias abaixo de 0°C" }, units: { avg_mean: "°C", avg_max: "°C", avg_min: "°C", absolute_max: "°C", absolute_min: "°C" } },
          precipitation: { name: "💧 Precipitação", props: { total_mm: "Total", avg_daily_mm: "Média Diária", max_daily_mm: "Máxima Diária", rainy_days: "Dias com Chuva", heavy_rain_days: "Dias com Chuva Forte" }, units: { total_mm: " mm", avg_daily_mm: " mm", max_daily_mm: " mm" } },
          wind: { name: "💨 Vento", props: { avg_speed_ms: "Velocidade Média", max_speed_ms: "Velocidade Máxima", windy_days: "Dias com Vento", very_windy_days: "Dias com Vento Muito Forte" }, units: { avg_speed_ms: " m/s", max_speed_ms: " m/s" } },
          humidity: { name: "💦 Umidade", props: { avg_pct: "Média", max_pct: "Máxima", min_pct: "Mínima", uncomfortable_days: "Dias Desconfortáveis" }, units: { avg_pct: "%", max_pct: "%", min_pct: "%" } },
          solar_cloud: { name: "☀️ Sol e Nuvens", props: { avg_solar_kwh_m2: "Radiação Solar Média", avg_cloud_cover_pct: "Cobertura de Nuvens Média", cloudy_days: "Dias Nublados" }, units: { avg_solar_kwh_m2: " kWh/m²", avg_cloud_cover_pct: "%" } }
      };
      let html = '<table class="weather-table">';
      for (const category in jsonData) {
          if (labels[category]) {
              html += `<thead><tr><th colspan="2">${labels[category].name}</th></tr></thead>`;
              html += '<tbody>';
              for (const prop in jsonData[category]) {
                  const label = labels[category].props[prop] || prop;
                  const value = jsonData[category][prop];
                  const unit = labels[category].units?.[prop] || "";
                  html += `<tr><td>${label}</td><td>${value}${unit}</td></tr>`;
              }
              html += '</tbody>';
          }
      }
      html += '</table>';
      return html;
    }


  return (
    <>
      <main className="container-main">
        <div className="container-map">
          <div className="box" >
            <MapPicker onLocationSelect={handleMapSelect} />
          </div>
          <div className="box2" >
            <div id="table-container">
            </div>
          </div>
        </div>

        <div className="row-filter-container">
          <div className="box-filter">
            <div className="container text-center">
              <div className="row">
                <div className="col">
                  <div className="fbox" style={{ marginTop: '8px' }}>
                    <div className="date-picker-container">
                      <label htmlFor="date-picker" style={{ marginRight: '8px', fontSize: '20px' }}>Selecione uma data:</label>
                      <input
                        type="date"
                        id="date-picker"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="fbox">
                    <button
                      onClick={handleSearch}
                      disabled={!selectedCoords || !selectedDate}
                    >
                      Search
                    </button>

                    <button
                      style={{ marginLeft: '40px' }}
                      onClick={handleGenerateGraphs}
                      disabled={!selectedCoords || !selectedDate}
                    >
                      Generate Graphs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedCoords && (
          <div className="coords-display">
            <p><strong>Latitude:</strong> {selectedCoords.lat.toFixed(4)}</p>
            <p><strong>Longitude:</strong> {selectedCoords.lng.toFixed(4)}</p>
          </div>
        )}

        {/* Renderiza o Graph somente se showGraph for true */}
        {showGraph && <Graph key={graphKey} />}
      </main>
    </>
  );
}

export default App;
