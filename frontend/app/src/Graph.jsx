import { useState, useEffect } from 'react';
import './Graph.css';

function Graph() {
  const [timestamp, setTimestamp] = useState(Date.now()); // Estado para forçar recarregamento

  useEffect(() => {
    // Recarrega as imagens quando o componente é montado/atualizado
    setTimestamp(Date.now());
  }, []);

  // Adicione o timestamp como query parameter nas URLs
  const query = `?t=${timestamp}`;
  const clouds = `http://localhost:5001/graphs/cloud_cover_pct.png${query}`;
  const humidity = `http://localhost:5001/graphs/humidity_pct.png${query}`;
  const precipitation = `http://localhost:5001/graphs/precipitation_mm.png${query}`;
  const solar = `http://localhost:5001/graphs/solar_radiation_kwh_m2.png${query}`;
  const humidity2 = `http://localhost:5001/graphs/specific_humidity_gkg.png${query}`;
  const temp_avg = `http://localhost:5001/graphs/temp_avg_c.png${query}`;
  const temp_max = `http://localhost:5001/graphs/temp_max_c.png${query}`;
  const temp_min = `http://localhost:5001/graphs/temp_min_c.png${query}`;
  const wind_max = `http://localhost:5001/graphs/wind_speed_max_ms.png${query}`;
  const wind = `http://localhost:5001/graphs/wind_speed_ms.png${query}`;

  return (
    <div className="container-graphs">
      <div className="container-graphs2">
        <h1 className="graphs-title">Historic Measurements</h1>

        <img src={clouds} alt="Cloud Coverage" />
        <img src={humidity} alt="Humidity" />
        <img src={precipitation} alt="Precipitation" />
        <img src={solar} alt="Solar Radiation" />
        <img src={humidity2} alt="Specific Humidity" />
        <img src={temp_avg} alt="Average Temperature" />
        <img src={temp_max} alt="Max Temperature" />
        <img src={temp_min} alt="Min Temperature" />
        <img src={wind_max} alt="Max Wind Speed" />
        <img src={wind} alt="Wind Speed" />
      </div>
    </div>
  )
}

export default Graph;