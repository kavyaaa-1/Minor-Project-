import Grid from '@mui/material/Grid';
import Weather from './weather';
import Clients from './clients';
import Location from './location';
import Activity from './activity';

const TopCards = () => {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6} xl={3}>
        <Location />
      </Grid>
      <Grid item xs={12} sm={6} xl={3}>
        <Weather />
      </Grid>
      <Grid item xs={12} sm={6} xl={3}>
        <Clients />
      </Grid>
      <Grid item xs={12} sm={6} xl={3}>
        <Activity />
      </Grid>
    </Grid>
  );
};

export default TopCards;
