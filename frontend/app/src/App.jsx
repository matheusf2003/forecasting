import { useState } from 'react';
//import Header from './components/Layout/Header';
import MapPicker from './components/Map/MapPicker';
import './App.css';


function App() {
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de loading
  const [weatherData, setWeatherData] = useState(null); // Estado para guardar a resposta
  const [selectedCoords, setSelectedCoords] = useState(null);
  // 1. Estado para armazenar a data selecionada
  const [selectedDate, setSelectedDate] = useState('');

  // Esta função será chamada pelo MapPicker com as coordenadas
  const handleMapSelect = (coords) => {
    console.log("Coordenadas selecionadas:", coords);
    setSelectedCoords(coords);
  };
  
  // 2. Função de busca atualizada
  const handleSearch = async () => {
    // Validação para garantir que ambos foram selecionados
    if (!selectedCoords || !selectedDate) {
      alert("Por favor, selecione um local no mapa e uma data.");
      return;
    }
    setIsLoading(true);
    setWeatherData(null);

    alert(`Buscando dados para Lat: ${selectedCoords.lat}, Lng: ${selectedCoords.lng} na data ${selectedDate}`);
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

    } catch (err) {
      console.error("Falha ao buscar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>     
      <main className="container-main">
        <div className="container-map">
          <div className="box" >
            <MapPicker onLocationSelect={handleMapSelect} />
          </div>
          <div className="box2" >

          </div>
        </div>
        
        <div className="row-filter-container">
          <div className="box-filter">
            <div class="container text-center">
              <div class="row">
                <div class="col">
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
                <div class="col">
                  <div className="fbox">
                    <button 
                        onClick={handleSearch}
                        // O botão fica desabilitado até que um local E uma data sejam escolhidos
                        disabled={!selectedCoords || !selectedDate} 
                        >
                        Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Exibe as coordenadas selecionadas para o usuário */}
        {selectedCoords && (
          <div className="coords-display">
            <p><strong>Latitude:</strong> {selectedCoords.lat.toFixed(4)}</p>
            <p><strong>Longitude:</strong> {selectedCoords.lng.toFixed(4)}</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;