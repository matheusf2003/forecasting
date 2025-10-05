import { useState } from 'react';
//import Header from './components/Layout/Header';
import MapPicker from './components/Map/MapPicker'; // Importe o novo componente
import './App.css'; // Crie este arquivo se não existir

function App() {
  const [selectedCoords, setSelectedCoords] = useState(null);

  // Esta função será chamada pelo MapPicker com as coordenadas
  const handleMapSelect = (coords) => {
    console.log("Coordenadas selecionadas:", coords);
    setSelectedCoords(coords);
  };
  
  // Função de busca (a ser conectada com o SearchForm)
  const handleSearch = async (date) => {
    if (!selectedCoords) {
      alert("Por favor, selecione um local no mapa.");
      return;
    }
    // Aqui você chamaria sua API usando selectedCoords e a data
    alert(`Buscando dados para Lat: ${selectedCoords.lat}, Lng: ${selectedCoords.lng} na data ${date}`);
  };

  return (
    <>

      <main className="mapa">
        {/* Você pode substituir seu SearchForm antigo ou adicionar o mapa a ele */}
        <h2>Selecione um local no mapa:</h2>
        <MapPicker onLocationSelect={handleMapSelect} />

        {/* Exibe as coordenadas selecionadas para o usuário */}
        {selectedCoords && (
          <div className="coords-display">
            <p><strong>Latitude:</strong> {selectedCoords.lat.toFixed(4)}</p>
            <p><strong>Longitude:</strong> {selectedCoords.lng.toFixed(4)}</p>
          </div>
        )}
        
        {/* Adicione o input de data e o botão de busca aqui */}
        {/* ... */}
      </main>
    </>
  );
}

export default App;