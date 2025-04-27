import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Link } from 'react-router-dom';
import { 
  Typography, Box, Grid, Card, CardContent, Button, CircularProgress
} from '@mui/material';

function Home() {
  const { isConnected, isLoading } = useWeb3();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Restaurant Loyalty Program
      </Typography>
      <Typography variant="body1" paragraph>
        This decentralized application allows restaurants to create and manage loyalty programs for their customers.
        Customers can earn and redeem loyalty points at participating restaurants.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Built on the Polkadot ecosystem using Moonbeam's EVM compatibility, this application demonstrates how blockchain
        technology can revolutionize customer loyalty programs with transparency, security, and interoperability.
      </Typography>
      
      {isConnected ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card className="restaurant-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Restaurant Owner
                </Typography>
                <Typography variant="body2" paragraph>
                  Manage your restaurant's loyalty program, add customers, and award points.
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/restaurant-dashboard"
                  fullWidth
                >
                  Go to Restaurant Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="restaurant-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Customer
                </Typography>
                <Typography variant="body2" paragraph>
                  View your loyalty points and redeem them at participating restaurants.
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/customer-dashboard"
                  fullWidth
                >
                  Go to Customer Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Please connect your wallet to access the application.
          </Typography>
          {isLoading && <CircularProgress sx={{ mt: 2 }} />}
        </Box>
      )}
      
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          About This Project
        </Typography>
        <Typography variant="body1" paragraph>
          This project was built for a hackathon to demonstrate the power of Polkadot's ecosystem for real-world applications.
          It leverages Moonbeam's EVM compatibility to create a seamless experience for both restaurant owners and customers.
        </Typography>
        <Typography variant="body1" paragraph>
          Smart contracts are deployed on the Moonbeam testnet (Moonbase Alpha) and can be viewed on the block explorer:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" component="a" href="https://moonbase.moonscan.io/address/0xB34e549E359571E73843c753D29388Ec4e5E8FF5" target="_blank" rel="noopener noreferrer">
              Factory Contract: 0xB34e549E359571E73843c753D29388Ec4e5E8FF5
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component="a" href="https://moonbase.moonscan.io/address/0x46C0b6161AB36932c1F0aAc971A3a434751fdc22" target="_blank" rel="noopener noreferrer">
              Token Contract: 0x46C0b6161AB36932c1F0aAc971A3a434751fdc22
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component="a" href="https://moonbase.moonscan.io/address/0xaEc1165eb2AE7E17f2f1C571d66DBc331E1B55D7" target="_blank" rel="noopener noreferrer">
              Main Contract: 0xaEc1165eb2AE7E17f2f1C571d66DBc331E1B55D7
            </Typography>
          </li>
        </ul>
      </Box>
    </Box>
  );
}

export default Home;
