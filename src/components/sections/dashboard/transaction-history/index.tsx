import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TransactionHistoryTable from './TransactionHistoryTable';
import { SelectChangeEvent } from '@mui/material/Select';

const TransactionHistory = () => {
  const [selectedCrop, setSelectedCrop] = useState('Turmeric'); // Set default crop to "Turmeric"

  // List of crop names to display in the dropdown
  const cropOptions = ['Cumin', 'Turmeric', 'Chillies', 'Pepper'];

  // Handle crop change with correct typing for SelectChangeEvent
  const handleCropChange = (e: SelectChangeEvent<string>) => {
    setSelectedCrop(e.target.value); // Update the selected crop
  };

  return (
    <Paper sx={{ px: 0, height: { xs: 642, sm: 396 } }}>
      <Stack
        px={3.5}
        spacing={{ xs: 2, sm: 0 }}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4" minWidth={200}>
          Crop Price History
        </Typography>

        {/* Dropdown for crop selection */}
        <FormControl variant="filled" sx={{ width: 1, maxWidth: 250 }}>
          <InputLabel id="select-crop-label"></InputLabel>
          <Select
            labelId="select-crop-label"
            value={selectedCrop}
            onChange={handleCropChange}
          >
            {cropOptions.map((crop) => (
              <MenuItem key={crop} value={crop}>
                {crop}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box mt={1.5} height={{ xs: 400, sm: 300 }}>
        {/* Pass the selected crop to TransactionHistoryTable */}
        <TransactionHistoryTable selectedCrop={selectedCrop} />
      </Box>
    </Paper>
  );
};

export default TransactionHistory;
