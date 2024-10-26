// PriceForecast.tsx
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PriceForecastChart from './PriceForecastChart.tsx';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Options for crops and districts
const cropOptions = ['Cumin', 'Turmeric', 'Chillies'];
const districtOptions = ['Agra', 'Hingoli', 'Amreli', 'Kollam', 'Ratlam'];

// Chart data for different time ranges
const rangeData = {
  '1 week': {
    data: [160, 320, 210, 270, 180, 350, 230],
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  },
  '1 month': { data: [780, 920, 650, 880], labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
  '6 months': {
    data: [2000, 2500, 1800, 2200, 2400, 2100],
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
  },
} as const;

type RangeOption = keyof typeof rangeData; // Define type for range keys

const PriceForecast = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Turmeric');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hingoli');
  const [selectedRange, setSelectedRange] = useState<RangeOption>('1 week'); // Initialize range selection

  const fetchForecast = async (crop: string, district: string) => {
    // Placeholder function to fetch forecast data
  };

  useEffect(() => {
    fetchForecast(selectedCrop, selectedDistrict);
  }, [selectedCrop, selectedDistrict]);

  const handleCropChange = (event: SelectChangeEvent) => {
    setSelectedCrop(event.target.value);
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value);
  };

  const handleRangeChange = (range: RangeOption) => {
    setSelectedRange(range);
  };

  return (
    <Paper sx={{ height: 400, p: 2 }}>
      <Stack direction="row" spacing={2.5} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h3">Crop Price Forecast</Typography>
          <Typography variant="caption" color="text.disabled" fontWeight={600}>
            Price Today: 3990
          </Typography>
        </Box>
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
        {/* District Selection */}
        <FormControl variant="filled" sx={{ width: 150 }}>
          <Select id="dist-select" value={selectedDistrict} onChange={handleDistrictChange}>
            {districtOptions.map((dist) => (
              <MenuItem key={dist} value={dist}>
                {dist}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box display="flex" alignItems="center" mt={2}>
      <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
          {['1 week', '1 month', '6 months'].map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? 'contained' : 'outlined'}
              onClick={() => handleRangeChange(range as RangeOption)}
              sx={{
                mb: 1,
                width: '120px',
                borderRadius: 2, // Rounded borders
                color: selectedRange === range ? 'white' : 'primary.main',
                bgcolor: selectedRange === range ? 'primary.main' : 'info.dark',
                border: '1px solid',
                borderColor: selectedRange === range ? 'primary.main' : 'info.dark',
                textTransform: 'none', // Disables uppercase transformation
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: selectedRange === range ? 'purple.dark' : 'disabled.dark',
                },
              }}
            >
              {range}
            </Button>
          ))}
        </Box>


        <PriceForecastChart
          data={rangeData[selectedRange].data.slice()} // Data updates based on selected range
          labels={rangeData[selectedRange].labels.slice()} // Labels for x-axis
          sx={{ height: '230px', width: '100%' }}
        />
      </Box>
    </Paper>
  );
};

export default PriceForecast;
