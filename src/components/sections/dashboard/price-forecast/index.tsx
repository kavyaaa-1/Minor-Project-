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
import { Autocomplete, TextField } from '@mui/material';

// Options for crops and districts
const cropOptions = [
  'Black pepper',
  'Chili Red',
  'Corriander seed',
  'Cummin Seed(Jeera)',
  'Turmeric',
];
const districtOptions = ['Adilabad', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola', 'Alappuzha', 'Amarawati', 'Amethi', 'Amreli', 'Angul', 'Anupur', 'Ariyalur', 'Ashoknagar', 'Ayodhya', 'Badwani', 'Bagalkot', 'Bahraich', 'Balaghat', 'Balasore', 'Balodabazar', 'Balotra', 'Balrampur', 'Banaskanth', 'Bangalore', 'Baran', 'Barmer', 'Barpeta', 'Beawar', 'Beed', 'Belgaum', 'Bellary', 'Bemetara', 'Bhandara', 'Bhavnagar', 'Bhilwara', 'Bhopal', 'Bidar', 'Bikaner', 'Bolangir', 'Botad', 'Buldhana', 'Bundi', 'Chamrajnagar', 'Chandrapur', 'Chattrapati Sambhajinagar', 'Chhindwara', 'Chikmagalur', 'Chitradurga', 'Coimbatore', 'Cuddalore', 'Cuddapah', 'Dahod', 'Davangere', 'Deedwana Kuchaman', 'Dehradoon', 'Devbhumi Dwarka', 'Dewas', 'Dhalai', 'Dhamtari', 'Dhar', 'Dharashiv(Usmanabad)', 'Dharmapuri', 'Dharwad', 'Dhule', 'Dindori', 'East Jaintia Hills', 'Ernakulam', 'Erode', 'Fatehpur', 'Gadag', 'Gadchiroli', 'Gajapati', 'Ganjam', 'Garhwa', 'Gir Somnath', 'Gonda', 'Guna', 'Guntur', 'Harda', 'Hassan', 'Hingoli', 'Hoshangabad', 'Hyderabad', 'Idukki', 'Indore', 'Jabalpur', 'Jaipur', 'Jalgaon', 'Jalore', 'Jammu', 'Jamnagar', 'Janjgir', 'Jashpur', 'Jhalawar', 'Jodhpur', 'Jodhpur Rural', 'Junagarh', 'Kachchh', 'Kandhamal', 'Kannur', 'Kanpur', 'Kanpur Dehat', 'Karimnagar', 'Karwar(Uttar Kannad)', 'Kasargod', 'Kekri', 'Khammam', 'Khandwa', 'Khargone', 'Kheda', 'Khiri (Lakhimpur)', 'Kohima', 'Kolar', 'Kolhapur', 'Kollam', 'Kondagaon', 'Koraput', 'Koria', 'Kota', 'Lakhimpur', 'Latur', 'Longleng', 'Madikeri(Kodagu)', 'Maharajganj', 'Mahasamund', 'Mahbubnagar', 'Malappuram', 'Mandla', 'Mandsaur', 'Mandya', 'Mangalore(Dakshin Kannad)', 'Medak', 'Mehsana', 'Morbi', 'Mumbai', 'Mungeli', 'Murshidabad', 'Murum', 'Mysore', 'Nagaur', 'Nagpur', 'Namakkal', 'Nanded', 'Nandurbar', 'Nanital', 'Narayanpur', 'Narsinghpur', 'Nashik', 'Neemuch', 'Nizamabad', 'Nongpoh (R-Bhoi)', 'North and Middle Andaman', 'Palakad', 'Pali', 'Parbhani', 'Patan', 'Peren', 'Phalodi', 'Phek', 'Pillibhit', 'Pondicherry', 'Porbandar', 'Pratapgarh', 'Pune', 'Raichur', 'Raigad', 'Raigarh', 'Raipur', 'Rajgarh', 'Rajkot', 'Ramanathapuram', 'Ranga Reddy', 'Ratlam', 'Rayagada', 'Sabarkantha', 'Salem', 'Samastipur', 'Sanchore', 'Sangli', 'Satara', 'Sehore', 'Shajapur', 'Shehdol', 'Sheopur', 'Shimoga', 'Shivpuri', 'Sholapur', 'Singroli', 'Sivaganga', 'South Andaman', 'South Goa', 'South West Garo Hills', 'South West Khasi Hills', 'Surat', 'Surendranagar', 'Surguja', 'Thirssur', 'Thiruvananthapuram', 'Thiruvannamalai', 'Tonk', 'Tsemenyu', 'Tuensang', 'Tumkur', 'Udaipur', 'Udupi', 'Ujjain', 'Unokoti', 'Vadodara(Baroda)', 'Vashim', 'Vellore', 'Vidisha', 'Villupuram', 'Virudhunagar', 'Warangal', 'Wayanad', 'West Garo Hills', 'West Jaintia Hills', 'Wokha', 'Yavatmal'];
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
  // const [selectedDistrict, setSelectedDistrict] = useState<string>('Hingoli');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>('Hingoli');
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
      fetchForecast(selectedCrop, selectedDistrict!); // Fetch predictions for 1 week
    }
  }, [selectedCrop, selectedDistrict, selectedRange]);

  const handleCropChange = (event: SelectChangeEvent) => {
    setSelectedCrop(event.target.value);
  };

  // const handleDistrictChange = (event: SelectChangeEvent) => {
  //   setSelectedDistrict(event.target.value);
  // };
  const handleDistrictChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setSelectedDistrict(newValue);
  };

  const handleRangeChange = (range: RangeOption) => {
    setSelectedRange(range);
    if (range === '1 week') {
      fetchForecast(selectedCrop, selectedDistrict!);
    }
  };

  return (
    <Paper sx={{ height: 430, p: 3 }}>
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
        {/* <FormControl variant="filled" sx={{ width: 150 }}>
          <Select id="dist-select" value={selectedDistrict} onChange={handleDistrictChange}>
            {districtOptions.map((dist) => (
              <MenuItem key={dist} value={dist}>
                {dist}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <FormControl variant="filled" sx={{ width: 200 }}>
      <Autocomplete
        id="district-select"
        options={districtOptions}
        value={selectedDistrict}
        onChange={handleDistrictChange}
        renderInput={(params) => (
          <TextField 
          {...params} 
          label="Select District" 
          variant="filled" 
          InputLabelProps={{
            style: { color: '#A3AED0', fontWeight:600 }, // Label text color
          }}
          // InputProps={{
          //   ...params.InputProps,
          //   style: { color: 'info.dark' },
          // }}
          />
        )}
        filterOptions={(options, state) =>
          options
            .filter((option) =>
              option.toLowerCase().includes(state.inputValue.toLowerCase())
            )
            // .slice(0, 5) // Show only the top 5 results
        }
        ListboxProps={{ style: { maxHeight: 160 } }} // Limits dropdown height to show 5 items at a time
        noOptionsText="No results found"
        PaperComponent={(props) => (
          <Paper
            {...props}
            sx={{
              backgroundColor: 'info.dark', // Light grey background for contrast
              border: 'disabled.dark', // Light grey border
              borderRadius: 2, // Slightly rounded corners
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)', // Soft shadow
            }}
          />
        )}
      />
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
