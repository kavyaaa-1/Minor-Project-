import Grid from '@mui/material/Grid';
import TopCards from 'components/sections/dashboard/top-cards';
// import AvatarCard from 'components/sections/dashboard/avatar-card';
import PriceForecast from 'components/sections/dashboard/price-forecast';
import RainfallData from 'components/sections/dashboard/map/map';
import Balance from 'components/sections/dashboard/balance';
// import SpentThisMonth from 'components/sections/dashboard/spent-this-month';
// import Transactions from 'components/sections/dashboard/transactions';
// import Tasks from 'components/sections/dashboard/tasks';
// import Earnings from 'components/sections/dashboard/earnings';
// import CreditBalance from 'components/sections/dashboard/credit-balance';
import TransactionHistory from 'components/sections/dashboard/transaction-history';
import { Divider, Typography } from '@mui/material';

const Dashbaord = () => {
  return (
    <Grid container spacing={2.5}>

      <Grid item xs={12}>
        <TopCards />
      </Grid>

      {/* Heading for Crop Information */}
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ mt: 4 }}> {/* Add margin-top here */}
          Crop Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={12}>
        <Balance />
      </Grid>

      <Grid item xs={12} md={8}>
        <TransactionHistory />
      </Grid>

      {/* <Grid item xs={12} md={4}>
        <AvatarCard />
      </Grid> */}

      {/* Heading for Crop Information */}
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ mt: 4 }}> {/* Add margin-top here */}
          Crop Price Prediction
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={8}>
        <PriceForecast />
      </Grid>

      {/* <Grid item xs={12} md={4}>
        <SpentThisMonth />
      </Grid> */}

      {/* Heading for Crop Information */}
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ mt: 4 }}> {/* Add margin-top here */}
          Rainfall Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={8}>
        <RainfallData />
      </Grid>

      {/* <Grid item xs={12} md={4}>
        <Transactions />
      </Grid> */}

      {/* <Grid item xs={12} md={4}>
        <Tasks />
      </Grid> */}

      {/* <Grid item xs={12} md={4}>
        <Earnings />
      </Grid> */}

      {/* <Grid item xs={12} md={4}>
        <CreditBalance />
      </Grid> */}

      
    </Grid>
  );
};

export default Dashbaord;
