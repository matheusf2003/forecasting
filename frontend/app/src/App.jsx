import { useState } from 'react';
import MapPicker from './components/Map/MapPicker';
import Graph from './Graph.jsx';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const [showGraph, setShowGraph] = useState(false);
  const [graphKey, setGraphKey] = useState(0);

  const handleMapSelect = (coords) => {
    setSelectedCoords(coords);
  };

  const handleSearch = async () => {
    if (!selectedCoords || !selectedDate) {
      alert("Please select a location on the map and a date.");
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
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setWeatherData(data);
      console.log("Data received:", data);
      const html = await createWeatherTable(data);
      document.getElementById('table-container').innerHTML = html;

    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function called when clicking "Generate Graphs"
  const handleGenerateGraphs = () => {
    setShowGraph(true); // Displays the Graph
    setGraphKey(prev => prev + 1); // Refreshes the Graph on each click
  };

  async function createWeatherTable(jsonData) {

      const labels = {
          period: { name: "📅 Period", props: { start: "Start Date", end: "End Date", days: "Total Days" }, units: { days: " days" } },
          temperature: { name: "🌡️ Temperature", props: { avg_mean: "Average", avg_max: "Average Max", avg_min: "Average Min", absolute_max: "Absolute Max", absolute_min: "Absolute Min", days_above_35c: "Days above 35°C", days_below_0c: "Days below 0°C" }, units: { avg_mean: "°C", avg_max: "°C", avg_min: "°C", absolute_max: "°C", absolute_min: "°C" } },
          precipitation: { name: "💧 Precipitation", props: { total_mm: "Total", avg_daily_mm: "Daily Average", max_daily_mm: "Daily Maximum", rainy_days: "Rainy Days", heavy_rain_days: "Heavy Rain Days" }, units: { total_mm: " mm", avg_daily_mm: " mm", max_daily_mm: " mm" } },
          wind: { name: "💨 Wind", props: { avg_speed_ms: "Average Speed", max_speed_ms: "Maximum Speed", windy_days: "Windy Days", very_windy_days: "Very Windy Days" }, units: { avg_speed_ms: " m/s", max_speed_ms: " m/s" } },
          humidity: { name: "💦 Humidity", props: { avg_pct: "Average", max_pct: "Maximum", min_pct: "Minimum", uncomfortable_days: "Uncomfortable Days" }, units: { avg_pct: "%", max_pct: "%", min_pct: "%" } },
          solar_cloud: { name: "☀️ Sun and Clouds", props: { avg_solar_kwh_m2: "Average Solar Radiation", avg_cloud_cover_pct: "Average Cloud Cover", cloudy_days: "Cloudy Days" }, units: { avg_solar_kwh_m2: " kWh/m²", avg_cloud_cover_pct: "%" } }
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
                      <label htmlFor="date-picker" style={{ marginRight: '8px', fontSize: '20px' }}>Select a date:</label>
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

        {/* Renders the Graph only if showGraph is true */}
        {showGraph && <Graph key={graphKey} />}
      </main>
    </>
  );
}

export default App;
