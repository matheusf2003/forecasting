import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Importa a biblioteca Leaflet

// Corrige um problema comum com o ícone do marcador no Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Componente interno para gerenciar os eventos do mapa
function LocationMarker({ onMapClick }) {
  const [position, setPosition] = useState(null);

  // Hook do React Leaflet que escuta eventos do mapa
  useMapEvents({
    click(e) {
      // Quando o mapa é clicado, atualiza a posição do marcador
      setPosition(e.latlng);
      // E chama a função do componente pai para retornar as coordenadas
      onMapClick(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Você selecionou aqui!</Popup>
    </Marker>
  );
}


// Componente principal do mapa
const MapPicker = ({ onLocationSelect }) => {
  // Coordenadas iniciais (centro de Uberlândia)
  const initialPosition = [-18.9184, -48.2772];

  const handleMapClick = (latlng) => {
    // Extrai latitude e longitude
    const { lat, lng } = latlng;
    // Envia para o componente pai (App.jsx)
    onLocationSelect({ lat, lng });
  };

  return (
    <MapContainer center={initialPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onMapClick={handleMapClick} />
    </MapContainer>
  );
};

export default MapPicker;