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
import axios from 'axios';
import { format, addDays } from 'date-fns';

// Options for crops and districts
const cropOptions = [
  'Black pepper',
  'Chili Red',
  'Corriander seed',
  'Cummin Seed(Jeera)',
  'Turmeric',
];
const districtOptions = [
  'Balasore',
  'Balodabazar',
  'Balotra',
  'Balrampur',
  'Banaskanth',
  'Bangalore',
  'Hingoli',
  'Amreli',
  'Kollam',
  'Ratlam',
];

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
axios.defaults.withCredentials = true;

const PriceForecast = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Turmeric');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hingoli');
  const [predictions, setPredictions] = useState<number[]>([]);
  const [selectedRange, setSelectedRange] = useState<RangeOption>('1 week'); // Initialize range selection

  const fetchForecast = async (crop: string, district: string) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/predict',
        {
          commodity: crop,
          district: district,
          min_price: 5000, // Replace with actual min price
          max_price: 12000, // Replace with actual max price
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
      console.log('response', response.data);
      setPredictions(response.data); // Set predictions from API response
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  useEffect(() => {
    if (selectedRange === '1 week') {
      fetchForecast(selectedCrop, selectedDistrict); // Fetch predictions for 1 week
    }
  }, [selectedCrop, selectedDistrict, selectedRange]);

  const handleCropChange = (event: SelectChangeEvent) => {
    setSelectedCrop(event.target.value);
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value);
  };

  const handleRangeChange = (range: RangeOption) => {
    setSelectedRange(range);
    if (range === '1 week') {
      fetchForecast(selectedCrop, selectedDistrict);
    }
  };

  return (
    <Paper sx={{ height: 400, p: 3 }}>
      <Stack direction="row" spacing={2.5} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h3">Crop Price Forecast</Typography>
          <Typography variant="caption" color="text.disabled" fontWeight={600}>
            Price Today: 7220
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
          data={selectedRange === '1 week' ? predictions : [...rangeData[selectedRange].data]}
          labels={
            selectedRange === '1 week'
              ? Array.from({ length: 7 }, (_, i) =>
                  format(addDays(new Date(), i + 1), 'dd-MM-yy'),
                )
              : [...rangeData[selectedRange].labels]
          }
          sx={{ height: '230px', width: '120%' }}
        />
      </Box>
    </Paper>
  );
};

export default PriceForecast;
