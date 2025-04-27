import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { 
  Typography, Box, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Grid, Snackbar, Alert
} from '@mui/material';

function RestaurantDashboard() {
  const { account, loyaltyContract, tokenContract } = useWeb3();
  
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [pointsToAward, setPointsToAward] = useState('');
  
  // Dialog states
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openAwardDialog, setOpenAwardDialog] = useState(false);
  
  // Load restaurant data
  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!loyaltyContract || !account) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        // Check if the current account owns a restaurant
        const restaurantCount = await loyaltyContract.restaurantCount();
        
        let found = false;
        for (let i = 1; i <= restaurantCount.toNumber(); i++) {
          const restaurant = await loyaltyContract.restaurants(i);
          if (restaurant.owner.toLowerCase() === account.toLowerCase()) {
            setRestaurantId(i);
            setRestaurantInfo(restaurant);
            setIsRegistered(true);
            found = true;
            break;
          }
        }
        
        if (!found) {
          setIsRegistered(false);
        }
        
      } catch (error) {
        console.error('Error loading restaurant data:', error);
        setError('Failed to load restaurant data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRestaurantData();
  }, [loyaltyContract, account]);
  
  // Register restaurant
  const registerRestaurant = async () => {
    if (!loyaltyContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const tx = await loyaltyContract.addRestaurant(
        restaurantName,
        restaurantDescription,
        account
      );
      
      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      setSuccess('Restaurant registered successfully!');
      
      // Reload restaurant data
      const restaurantCount = await loyaltyContract.restaurantCount();
      const restaurant = await loyaltyContract.restaurants(restaurantCount);
      
      setRestaurantId(restaurantCount.toNumber());
      setRestaurantInfo(restaurant);
      setIsRegistered(true);
      
      setOpenRegisterDialog(false);
      
    } catch (error) {
      console.error('Error registering restaurant:', error);
      setError('Failed to register restaurant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Award points to customer
  const awardPoints = async () => {
    if (!loyaltyContract || !restaurantId) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const tx = await loyaltyContract.awardPoints(
        restaurantId,
        customerAddress,
        ethers.utils.parseUnits(pointsToAward, 0)
      );
      
      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      setSuccess('Points awarded successfully!');
      
      setOpenAwardDialog(false);
      setCustomerAddress('');
      setPointsToAward('');
      
    } catch (error) {
      console.error('Error awarding points:', error);
      setError('Failed to award points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !isRegistered) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Restaurant Dashboard
      </Typography>
      
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      
      {success && (
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      
      {!isRegistered ? (
        <Box>
          <Typography variant="body1" paragraph>
            You don't have a registered restaurant yet. Register your restaurant to start managing your loyalty program.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenRegisterDialog(true)}
          >
            Register Restaurant
          </Button>
          
          {/* Register Restaurant Dialog */}
          <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)}>
            <DialogTitle>Register Restaurant</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Restaurant Name"
                fullWidth
                variant="outlined"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={restaurantDescription}
                onChange={(e) => setRestaurantDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRegisterDialog(false)}>Cancel</Button>
              <Button 
                onClick={registerRestaurant}
                disabled={!restaurantName || !restaurantDescription || isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Box>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {restaurantInfo.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {restaurantInfo.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {restaurantInfo.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </CardContent>
          </Card>
          
          <Typography variant="h5" gutterBottom>
            Manage Loyalty Program
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Award Points
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Award loyalty points to customers who dine at your restaurant.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setOpenAwardDialog(true)}
                    fullWidth
                  >
                    Award Points to Customer
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Award Points Dialog */}
          <Dialog open={openAwardDialog} onClose={() => setOpenAwardDialog(false)}>
            <DialogTitle>Award Points to Customer</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Customer Address"
                fullWidth
                variant="outlined"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Points to Award"
                fullWidth
                variant="outlined"
                type="number"
                value={pointsToAward}
                onChange={(e) => setPointsToAward(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAwardDialog(false)}>Cancel</Button>
              <Button 
                onClick={awardPoints}
                disabled={!customerAddress || !pointsToAward || isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Award Points'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}

export default RestaurantDashboard;
