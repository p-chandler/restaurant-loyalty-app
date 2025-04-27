import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Link } from 'react-router-dom';
import { 
  Typography, Box, Grid, Card, CardContent, Button, CircularProgress,
  CardMedia, Container
} from '@mui/material';

function Home() {
  const { isConnected, isLoading } = useWeb3();

  // Fictional restaurant data
  const restaurants = [
    {
      name: "Pixel Bistro",
      description: "A modern fusion restaurant with tech-inspired ambiance",
      merchandise: "Exclusive branded coffee mug",
      image: "/images/modern_restaurant.jpeg"
    },
    {
      name: "Blockchain Brewery",
      description: "Craft beer and pub food in a blockchain-themed setting",
      merchandise: "Limited edition t-shirt",
      image: "/images/neon_bar.png"
    },
    {
      name: "Crypto Café",
      description: "Cozy café serving specialty coffees in a crypto-friendly environment",
      merchandise: "Reusable coffee cup",
      image: "/images/cozy_cafe.png"
    },
    {
      name: "Web3 Wok",
      description: "Asian fusion restaurant celebrating decentralized technology",
      merchandise: "Signature recipes cookbook",
      image: "/images/japanese_restaurant.png"
    },
    {
      name: "Metaverse Munchies",
      description: "Fast-casual dining with a virtual reality twist",
      merchandise: "VR dining experience voucher",
      image: "/images/fantasy_dining.png"
    }
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Blockchain Bites
      </Typography>
      <Typography variant="h5" color="primary" gutterBottom>
        Restaurant Loyalty Program on the Blockchain
      </Typography>
      
      <Typography variant="body1" paragraph>
        This decentralized application allows restaurants to create and manage loyalty programs for their customers.
        Customers can earn and redeem loyalty points at participating restaurants, and receive exclusive NFT welcome gifts!
      </Typography>
      
      <Typography variant="body1" paragraph>
        Built on the Polkadot ecosystem using Moonbeam's EVM compatibility, this application demonstrates how blockchain
        technology can revolutionize customer loyalty programs with transparency, security, and interoperability.
      </Typography>
      
      {isConnected ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card className="restaurant-card" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Restaurant Owner
                </Typography>
                <Typography variant="body2" paragraph>
                  Manage your restaurant's loyalty program, add customers, award points, and offer welcome NFTs.
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
            <Card className="restaurant-card" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Customer
                </Typography>
                <Typography variant="body2" paragraph>
                  View your loyalty points, redeem them at participating restaurants, and collect welcome NFTs.
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
          Participating Restaurants
        </Typography>
        <Typography variant="body1" paragraph>
          Join these innovative restaurants already using our blockchain loyalty program:
        </Typography>
        
        <Grid container spacing={4}>
          {restaurants.map((restaurant, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.image}
                  alt={restaurant.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {restaurant.name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {restaurant.description}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Welcome Gift: {restaurant.merchandise}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
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
            <Typography variant="body2" component="a" href="https://moonbase.moonscan.io/address/0x67B152592426AACeaa0692AeB42D048150B8D0c4" target="_blank" rel="noopener noreferrer">
              Token Contract: 0x67B152592426AACeaa0692AeB42D048150B8D0c4
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component="a" href="https://moonbase.moonscan.io/address/0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7" target="_blank" rel="noopener noreferrer">
              Main Contract: 0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component="a" href="https://moonbase.moonscan.io/address/0x27A2e33E1F13863E64BDc5bc04deCA4A9875231c" target="_blank" rel="noopener noreferrer">
              NFT Contract: 0x27A2e33E1F13863E64BDc5bc04deCA4A9875231c
            </Typography>
          </li>
        </ul>
      </Box>
    </Box>
  );
}

export default Home;
