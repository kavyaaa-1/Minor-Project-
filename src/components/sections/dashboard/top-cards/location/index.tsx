import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const Earnings = () => {
  return (
    <Paper
      component={Stack}
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 2, py: 3 }}
    >
      <Stack alignItems="center" justifyContent="flex-start" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          height={80}
          width={56}
          // bgcolor="info.main"
          borderRadius="50%"
        >
          <IconifyIcon icon="ic:round-location-on" color="primary.main" fontSize="h2.fontSize" />

        </Stack>
        <Box>
          <Typography variant="body2" color="text.disabled" fontWeight={500}>
            Your Location
          </Typography>
          <Typography mt={1} variant="h6" fontWeight={600}>
          Rampur, Mirzapur, Uttar Pradesh
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Earnings;
