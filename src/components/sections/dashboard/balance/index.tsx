import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import BalanceChart from './BalanceChart';
import * as XLSX from 'xlsx';

interface RawTransaction {
  'Sl no.': number;
  'District Name': string;
  'Market Name': string;
  'Commodity': string;
  'Variety': string;
  'Grade': string;
  'Min Price (Rs./Quintal)': number;
  'Max Price (Rs./Quintal)': number;
  'Modal Price (Rs./Quintal)': number;
  'Price Date': string | number; // Can be a date or an Excel serial number
}

// Available crops
const cropOptions = ['Cumin', 'Turmeric', 'Chillies'];

// Available years
const yearOptions = [2010, 2011, 2012, 2013, 2014, 2015];

const convertExcelDateToJSDate = (excelSerialDate: number): string => {
  const date = new Date((excelSerialDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const Balance = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Turmeric');
  const [selectedYear, setSelectedYear] = useState<number>(2014); // Default year is 2015
  const [chartData, setChartData] = useState<{ min: number[]; max: number[] }>({ min: [], max: [] });

  // Function to fetch data from Excel
  const fetchCropData = async (crop: string, year: number) => {
    const cropFileMap: { [key: string]: string } = {
      Cumin: 'cumin_data.xlsx',
      Turmeric: 'turmeric_data.xlsx',
      Chillies: 'chilli_data.xlsx',
    };

    const fileName = cropFileMap[crop];
    if (!fileName) return;

    try {
      const response = await fetch(`venus/src/data/${fileName}`);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: RawTransaction[] = XLSX.utils.sheet_to_json(worksheet);

      const monthData: { [key: string]: { min: number[]; max: number[] } } = {};

      jsonData.forEach((row) => {
        let priceDate = row['Price Date'];
        if (typeof priceDate === 'number') {
          priceDate = convertExcelDateToJSDate(priceDate); // Convert Excel serial date to JS date
        }
        const rowYear = new Date(priceDate).getFullYear();
        const rowMonth = new Date(priceDate).getMonth(); // 0 = January, 1 = February, etc.

        // Filter by the selected year
        if (rowYear === year) {
          const minPrice = row['Min Price (Rs./Quintal)'];
          const maxPrice = row['Max Price (Rs./Quintal)'];

          // Group prices by month
          if (!monthData[rowMonth]) {
            monthData[rowMonth] = { min: [], max: [] }; // Initialize if month doesn't exist
          }
          monthData[rowMonth].min.push(minPrice); // Add min price for the month
          monthData[rowMonth].max.push(maxPrice); // Add max price for the month
        }
      });

      // Aggregate prices for each month
      const aggregatedMin: number[] = [];
      const aggregatedMax: number[] = [];

      Object.keys(monthData).forEach((month) => {
        const prices = monthData[month];
        
        const minPrice = prices.min.length ? Math.min(...prices.min) : 0;
        const maxPrice = prices.max.length ? Math.max(...prices.max) : 0;

        aggregatedMin.push(minPrice);
        aggregatedMax.push(maxPrice);
      });

      // Update the state with the new datasets
      setChartData({ min: aggregatedMin, max: aggregatedMax });
    } catch (error) {
      console.error('Error loading Excel file:', error);
    }
  };

  useEffect(() => {
    fetchCropData(selectedCrop, selectedYear);
  }, [selectedCrop, selectedYear]);

  const handleCropChange = (event: SelectChangeEvent) => {
    setSelectedCrop(event.target.value);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <Paper sx={{ height: { xs: 500, sm: 355 } }}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h4" color="text.primary">
          Crop Price Trend
        </Typography>

        {/* Crop Selection */}
        <FormControl variant="filled" sx={{ width: 150 }}>
          <Select id="crop-select" value={selectedCrop} onChange={handleCropChange}>
            {cropOptions.map((crop) => (
              <MenuItem key={crop} value={crop}>
                {crop}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Selection */}
        <FormControl variant="filled" sx={{ width: 105 }}>
          <Select id="year-select" value={selectedYear.toString()} onChange={handleYearChange}>
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Pass chart data to BalanceChart */}
      <BalanceChart
        data={chartData}
        sx={{ width: 1, height: '220px !important' }}
      />
    </Paper>
  );
};

export default Balance;
