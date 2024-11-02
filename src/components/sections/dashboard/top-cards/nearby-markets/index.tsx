import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';

const mandis = [
  { name: 'Ahirora Mandi', distance: '5 km', address: 'Near Rampur Bus Stand' },
  { name: 'Mirzapur Mandi', distance: '15 km', address: 'Opposite Mirzapur Railway Station' },
];

const MandiList = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Nearby Mandis
      </Typography>
      <List>
        {mandis.map((mandi, index) => (
          <ListItem key={index} sx={{ padding: 0 }}> {/* Remove padding from ListItem */}
            <ListItemIcon sx={{ minWidth: 40 }}> {/* Ensure consistent icon size */}
              <IconifyIcon icon="ic:round-location-on" color="warning.main" fontSize="h3.fontSize" />
            </ListItemIcon>
            <ListItemText 
              primary={mandi.name} 
              secondary={`Distance: ${mandi.distance} - ${mandi.address}`} 
              primaryTypographyProps={{ sx: { margin: 0 } }}  
              secondaryTypographyProps={{ sx: { margin: 0 } }} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MandiList;
