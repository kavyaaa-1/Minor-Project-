import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import * as d3 from 'd3';

interface RainfallData {
  state: string;
  year: number;
  month: number;
  avgRainfall: number;
}

interface GeoFeature {
  type: 'Feature';
  properties: {
    NAME_1: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

const IndiaRainfallMap: React.FC = () => {
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedRainfall, setSelectedRainfall] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(10);
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rainfallResponse = await fetch(`venus/src/data/grouped_rainfall_data.csv`);
        const rainfallText = await rainfallResponse.text();
        const parsedRainfallData = d3.csvParse(rainfallText, (d) => ({
          state: d.State?.trim().toLowerCase(),
          year: +d.Year,
          month: +d.Month,
          avgRainfall: +d.Avg_rainfall || 0,
        }));
        setRainfallData(parsedRainfallData as RainfallData[]);

        const geoResponse = await fetch(`venus/src/data/india.geo.json`);
        const geoJsonData = await geoResponse.json();
        setGeoData(geoJsonData as GeoJSONData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const filteredData = rainfallData.filter(
    (d) => d.year === selectedYear && d.month === selectedMonth
  );

  const handleStateClick = (event: React.MouseEvent, stateName: string) => {
    const normalizedStateName = stateName.toLowerCase();
    const stateData = filteredData.find((d) => d.state === normalizedStateName);
    setSelectedState(stateName);
    setSelectedRainfall(stateData ? stateData.avgRainfall : null);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <h2>Average Rainfall Map</h2>

      <label htmlFor="year">Select Year: </label>
      <select id="year" onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {[2019, 2020, 2021, 2022, 2023].map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <label htmlFor="month">Select Month: </label>
      <select id="month" onChange={(e) => setSelectedMonth(Number(e.target.value))}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      {geoData && (
        <ComposableMap projectionConfig={{ scale: 1200, center: [78, 22] }} style={{ width: '100%', height: '100%' }}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.NAME_1;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EEE" // Static fill color
                    onClick={(event) => handleStateClick(event, stateName)}
                    style={{
                      default: { stroke: 'black', strokeWidth: 0.5 },
                      hover: { fill: '#FFD700', stroke: 'black', strokeWidth: 0.5 },
                      pressed: { strokeWidth: 0 },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      )}

      {selectedState && selectedRainfall !== null && tooltipPosition && (
        <div
          style={{
            position: 'absolute',
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            pointerEvents: 'none',
          }}
        >
          <strong>{selectedState}</strong>
          <br />
          Avg Rainfall: {selectedRainfall.toFixed(2)} mm
        </div>
      )}
    </div>
  );
};

export default IndiaRainfallMap;
