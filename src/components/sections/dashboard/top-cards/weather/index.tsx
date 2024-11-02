import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import WeatherChart from './WeatherChart'; 

const Weather = () => {
  return (
    <Paper component={Stack} alignItems="center" justifyContent="space-between" sx={{ py: 2.5 }}>
      <Box>
        <Typography variant="body2" color="text.disabled" fontWeight={500}>
          Weather Forecast
        </Typography>
        <Typography mt={1} variant="h4">
          32°C / 21°C
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Partly Cloudy
        </Typography>
      </Box>

      <WeatherChart data={[33, 31, 32, 31, 28, 30, 29]} sx={{ width: 250, height: '90px !important' }} />
    </Paper>
  );
};

export default Weather;
