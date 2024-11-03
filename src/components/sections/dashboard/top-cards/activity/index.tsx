import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { Theme } from '@mui/material/styles';

const cropData = [
  { name: 'Wheat', price: '₹2571/Quintal' },
  { name: 'Rice', price: '₹3513/Quintal' },
  { name: 'Maize', price: '₹5563/Quintal' },
  { name: 'Sugarcane', price: '₹350/Quintal' },
];

const CropPricesCard = () => {
  return (
    <Paper
      component={Stack}
      alignItems="center" // Center items in the main stack
      spacing={2}
      sx={(theme: Theme) => ({
        px: 3,
        py: 2.5,
        background: `linear-gradient(135deg, ${theme.palette.gradients.primary.state} 0%, ${theme.palette.gradients.primary.main} 100%)`,
        color: theme.palette.info.light,
      })}
    >
      <Box width="100%" display="flex" justifyContent="flex-start">
        <Typography variant="h5" color="info.light" fontWeight={600}>
          Top Crop Prices
        </Typography>
      </Box>

      <Box width="100%" mt={1}>
        {cropData.map((crop, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              py: 0.5,
              borderBottom: index < cropData.length - 1 
                ? `1px solid ${(theme: Theme) => theme.palette.divider}` 
                : 'none',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}> {/* Reduced spacing here */}
              <IconifyIcon icon="mdi:seed" fontSize="medium" color="info.light" />
              <Typography variant="body2" fontWeight={600}>
                {crop.name}
              </Typography>
            </Stack>
            <Typography variant="body2" fontWeight={500} color="info.light">
              {crop.price}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Paper>
  );
};

export default CropPricesCard;
