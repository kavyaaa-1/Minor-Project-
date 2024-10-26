import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import * as d3 from 'd3';

// Define interfaces for rainfall data and GeoJSON features
interface RainfallData {
  state: string;
  year: number;
  month: number;
  avgRainfall: number;
}

interface GeoFeature {
  type: 'Feature';
  properties: {
    NAME_1: string; // Adjust based on your GeoJSON structure
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon'; // Adjust based on your GeoJSON structure
    coordinates: number[][][] | number[][][][]; // For Polygon and MultiPolygon
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

const IndiaRainfallMap: React.FC = () => {
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredRainfall, setHoveredRainfall] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null); // GeoJSON data

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load rainfall data from CSV
        const rainfallResponse = await fetch(`venus/src/data/grouped_rainfall_data.csv`);
        const rainfallText = await rainfallResponse.text();
        const parsedRainfallData = d3.csvParse(rainfallText, (d) => ({
          state: d.State,
          year: +d.Year,
          month: +d.Month,
          avgRainfall: +d.Avg_rainfall || 0,
        }));
        setRainfallData(parsedRainfallData as RainfallData[]); // Type assertion

        // Load GeoJSON data
        const geoResponse = await fetch(`venus/src/data/custom.geo.json`);
        const geoJsonData = await geoResponse.json();
        setGeoData(geoJsonData as GeoJSONData); // Type assertion
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Filter data for selected year and month
  const filteredData = rainfallData.filter(d => {
    return d.year === selectedYear && (selectedMonth === null || d.month === selectedMonth);
  });

  // Color scale for rainfall values
  const colorScale = scaleQuantize<string>()
    .domain([0, d3.max(filteredData, d => d.avgRainfall) || 0])
    .range(['#f7fbff', '#6baed6', '#2171b5', '#08306b']);

  const handleMouseEnter = (stateName: string) => {
    const stateData = filteredData.find(d => d.state === stateName);
    setHoveredState(stateName);
    setHoveredRainfall(stateData ? stateData.avgRainfall : null);
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    setHoveredRainfall(null);
  };

  return (
    <div>
      <h2>Average Rainfall Map</h2>

      <label htmlFor="year">Select Year: </label>
      <select id="year" onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {[2019, 2020, 2021, 2022, 2023, 2024].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <label htmlFor="month">Select Month: </label>
      <select id="month" onChange={(e) => setSelectedMonth(Number(e.target.value))}>
        <option value="">All Months</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      {geoData && (
        <ComposableMap projectionConfig={{ scale: 1000 }}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map(geo => {
                const stateName = geo.properties.NAME_1; // Adjust this according to your GeoJSON
                const stateData = filteredData.find(d => d.state === stateName);
                const fillColor = stateData ? colorScale(stateData.avgRainfall) : '#EEE';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    onMouseEnter={() => handleMouseEnter(stateName)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#FFD700', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      )}

      {hoveredState && hoveredRainfall !== null && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: 'white', padding: '10px', borderRadius: '5px' }}>
          <strong>{hoveredState}</strong>
          <br />
          Avg Rainfall: {hoveredRainfall.toFixed(2)} mm
        </div>
      )}
    </div>
  );
};

export default IndiaRainfallMap;
