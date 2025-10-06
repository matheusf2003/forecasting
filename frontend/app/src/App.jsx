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

  return (
    <>
      <main className="container-main">
        <div className="container-map">
          <div className="box">
            <MapPicker onLocationSelect={handleMapSelect} />
          </div>
          <div className="box2"></div>
        </div>

        <div className="row-filter-container">
          <div className="box-filter">
            <div className="container text-center">
              <div className="row">
                <div className="col">
                  <div className="fbox" style={{ marginTop: '8px' }}>
                    <div className="date-picker-container">
                      <label htmlFor="date-picker" style={{ marginRight: '8px', fontSize: '20px' }}>
                        Selecione uma data:
                      </label>
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
