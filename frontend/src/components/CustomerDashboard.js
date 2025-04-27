import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { 
  Typography, Box, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Grid, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

function CustomerDashboard() {
  const { account, loyaltyContract, tokenContract } = useWeb3();
  
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantPoints, setRestaurantPoints] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  
  // Dialog states
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openRedeemDialog, setOpenRedeemDialog] = useState(false);
  
  // Load customer data
  useEffect(() => {
    const loadCustomerData = async () => {
      if (!loyaltyContract || !tokenContract || !account) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        // Check if the current account is a registered customer
        const customer = await loyaltyContract.customers(account);
        setCustomerInfo(customer);
        setIsRegistered(customer.isRegistered);
        
        if (customer.isRegistered) {
          // Get total points
          const totalPoints = await loyaltyContract.getCustomerTotalPoints(account);
          setTotalPoints(totalPoints.toString());
          
          // Get all restaurants
          const restaurantCount = await loyaltyContract.restaurantCount();
          const restaurantsArray = [];
          const pointsMap = {};
          
          for (let i = 1; i <= restaurantCount.toNumber(); i++) {
            const restaurant = await loyaltyContract.restaurants(i);
            if (restaurant.isActive) {
              restaurantsArray.push({
                id: i,
                name: restaurant.name,
                description: restaurant.description,
                owner: restaurant.owner
              });
              
              // Get points for this restaurant
              const points = await loyaltyContract.getCustomerPoints(i, account);
              pointsMap[i] = points.toString();
            }
          }
          
          setRestaurants(restaurantsArray);
          setRestaurantPoints(pointsMap);
        }
        
      } catch (error) {
        console.error('Error loading customer data:', error);
        setError('Failed to load customer data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomerData();
  }, [loyaltyContract, tokenContract, account]);
  
  // Register customer
  const registerCustomer = async () => {
    if (!loyaltyContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const tx = await loyaltyContract.registerCustomer(customerName);
      
      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      setSuccess('Registration successful!');
      
      // Reload customer data
      const customer = await loyaltyContract.customers(account);
      setCustomerInfo(customer);
      setIsRegistered(true);
      
      setOpenRegisterDialog(false);
      
    } catch (error) {
      console.error('Error registering customer:', error);
      setError('Failed to register customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redeem points
  const redeemPoints = async () => {
    if (!loyaltyContract || !tokenContract || !selectedRestaurant) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const LOYALTY_ADDRESS = '0xaEc1165eb2AE7E17f2f1C571d66DBc331E1B55D7';
      
      // Approve token transfer
      const approveTx = await tokenContract.approve(
        LOYALTY_ADDRESS,
        ethers.utils.parseUnits(pointsToRedeem, 0)
      );
      
      setSuccess('Approval transaction submitted. Waiting for confirmation...');
      
      await approveTx.wait();
      
      setSuccess('Approval successful! Redeeming points...');
      
      // Redeem points
      const redeemTx = await loyaltyContract.redeemPoints(
        selectedRestaurant,
        ethers.utils.parseUnits(pointsToRedeem, 0)
      );
      
      setSuccess('Redemption transaction submitted. Waiting for confirmation...');
      
      await redeemTx.wait();
      
      setSuccess('Points redeemed successfully!');
      
      // Reload customer data
      const totalPoints = await loyaltyContract.getCustomerTotalPoints(account);
      setTotalPoints(totalPoints.toString());
      
      const points = await loyaltyContract.getCustomerPoints(selectedRestaurant, account);
      setRestaurantPoints({
        ...restaurantPoints,
        [selectedRestaurant]: points.toString()
      });
      
      setOpenRedeemDialog(false);
      setSelectedRestaurant('');
      setPointsToRedeem('');
      
    } catch (error) {
      console.error('Error redeeming points:', error);
      setError('Failed to redeem points. Please try again.');
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
        Customer Dashboard
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
            You're not registered as a customer yet. Register to start earning loyalty points at participating restaurants.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenRegisterDialog(true)}
          >
            Register as Customer
          </Button>
          
          {/* Register Customer Dialog */}
          <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)}>
            <DialogTitle>Register as Customer</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Your Name"
                fullWidth
                variant="outlined"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRegisterDialog(false)}>Cancel</Button>
              <Button 
                onClick={registerCustomer}
                disabled={!customerName || isLoading}
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
                Welcome, {customerInfo.name}
              </Typography>
              <Typography variant="h6">
                Total Loyalty Points: <span className="points-badge">{totalPoints}</span>
              </Typography>
            </CardContent>
          </Card>
          
          <Typography variant="h5" gutterBottom>
            Participating Restaurants
          </Typography>
          
          {restaurants.length === 0 ? (
            <Typography variant="body1">
              No participating restaurants found.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Restaurant</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Your Points</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>{restaurant.name}</TableCell>
                      <TableCell>{restaurant.description}</TableCell>
                      <TableCell>{restaurantPoints[restaurant.id] || '0'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small"
                          disabled={!restaurantPoints[restaurant.id] || restaurantPoints[restaurant.id] === '0'}
                          onClick={() => {
                            setSelectedRestaurant(restaurant.id);
                            setOpenRedeemDialog(true);
                          }}
                        >
                          Redeem Points
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Redeem Points Dialog */}
          <Dialog open={openRedeemDialog} onClose={() => setOpenRedeemDialog(false)}>
            <DialogTitle>Redeem Points</DialogTitle>
            <DialogContent>
              <Typography variant="body2" paragraph>
                Available Points: {selectedRestaurant ? restaurantPoints[selectedRestaurant] || '0' : '0'}
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Points to Redeem"
                fullWidth
                variant="outlined"
                type="number"
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(e.target.value)}
                inputProps={{
                  min: 1,
                  max: selectedRestaurant ? restaurantPoints[selectedRestaurant] || 0 : 0
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRedeemDialog(false)}>Cancel</Button>
              <Button 
                onClick={redeemPoints}
                disabled={
                  !pointsToRedeem || 
                  parseInt(pointsToRedeem) <= 0 || 
                  (selectedRestaurant && parseInt(pointsToRedeem) > parseInt(restaurantPoints[selectedRestaurant] || '0')) ||
                  isLoading
                }
              >
                {isLoading ? <CircularProgress size={24} /> : 'Redeem'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}

export default CustomerDashboard;
