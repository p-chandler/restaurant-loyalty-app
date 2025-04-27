import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { 
  Typography, Box, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Grid, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Divider, Chip, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import RedeemIcon from '@mui/icons-material/Redeem';

function CustomerDashboard() {
  const { account, loyaltyContract, tokenContract, nftContract } = useWeb3();
  
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantPoints, setRestaurantPoints] = useState({});
  const [welcomeNFTs, setWelcomeNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedRestaurantForNFT, setSelectedRestaurantForNFT] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);
  
  // Dialog states
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openRedeemDialog, setOpenRedeemDialog] = useState(false);
  const [openNFTDialog, setOpenNFTDialog] = useState(false);
  const [openRedeemNFTDialog, setOpenRedeemNFTDialog] = useState(false);
  
  // Load customer data
  useEffect(() => {
    const loadCustomerData = async () => {
      if (!loyaltyContract || !tokenContract || !nftContract || !account) return;
      
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
                owner: restaurant.owner,
                merchandise: restaurant.merchandise
              });
              
              // Get points for this restaurant
              const points = await loyaltyContract.getCustomerPoints(i, account);
              pointsMap[i] = points.toString();
            }
          }
          
          setRestaurants(restaurantsArray);
          setRestaurantPoints(pointsMap);
          
          // Get welcome NFTs
          try {
            const nftIds = await loyaltyContract.getCustomerWelcomeNFTs(account);
            
            const nftsData = await Promise.all(
              nftIds.map(async (id) => {
                const restaurantId = await nftContract.tokenRestaurant(id);
                const isRedeemed = await nftContract.tokenRedeemed(id);
                const restaurant = restaurantsArray.find(r => r.id.toString() === restaurantId.toString()) || { name: 'Unknown Restaurant', merchandise: 'Unknown Merchandise' };
                
                return {
                  id: id.toString(),
                  restaurantId: restaurantId.toString(),
                  restaurantName: restaurant.name,
                  merchandise: restaurant.merchandise,
                  isRedeemed
                };
              })
            );
            
            setWelcomeNFTs(nftsData);
          } catch (nftError) {
            console.error('Error loading NFTs:', nftError);
          }
        }
        
      } catch (error) {
        console.error('Error loading customer data:', error);
        setError('Failed to load customer data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomerData();
  }, [loyaltyContract, tokenContract, nftContract, account]);
  
  // Register customer
  const registerCustomer = async () => {
    if (!loyaltyContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Register with selected restaurant for welcome NFT
      const restaurantId = selectedRestaurantForNFT ? parseInt(selectedRestaurantForNFT) : 0;
      
      const tx = await loyaltyContract.registerCustomer(customerName, restaurantId);
      
      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      setSuccess(restaurantId > 0 ? 
        'Registration successful! You received a welcome NFT!' : 
        'Registration successful!'
      );
      
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
      
      const LOYALTY_ADDRESS = '0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7';
      
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
  
  // Redeem welcome NFT
  const redeemWelcomeNFT = async () => {
    if (!loyaltyContract || !selectedNFT) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const tx = await loyaltyContract.redeemWelcomeNFT(selectedNFT.id);
      
      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      setSuccess('NFT redeemed successfully! You can now claim your free merchandise.');
      
      // Update NFT status
      setWelcomeNFTs(welcomeNFTs.map(nft => 
        nft.id === selectedNFT.id ? { ...nft, isRedeemed: true } : nft
      ));
      
      setOpenRedeemNFTDialog(false);
      setSelectedNFT(null);
      
    } catch (error) {
      console.error('Error redeeming NFT:', error);
      setError('Failed to redeem NFT. Please try again.');
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
          <Typography variant="body1" paragraph>
            Choose a restaurant to receive a welcome NFT that can be redeemed for free merchandise!
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
              
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Select a restaurant to receive a welcome NFT (optional):
              </Typography>
              
              <TextField
                select
                fullWidth
                variant="outlined"
                value={selectedRestaurantForNFT}
                onChange={(e) => setSelectedRestaurantForNFT(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">None</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} - {restaurant.merchandise}
                  </option>
                ))}
              </TextField>
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
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CardGiftcardIcon />}
                  onClick={() => setOpenNFTDialog(true)}
                  disabled={welcomeNFTs.length === 0}
                >
                  View Welcome NFTs ({welcomeNFTs.length})
                </Button>
              </Box>
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
                    <TableCell>Welcome Gift</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restaurants.map((restaurant) => {
                    const hasNFT = welcomeNFTs.some(nft => nft.restaurantId === restaurant.id.toString());
                    const nft = welcomeNFTs.find(nft => nft.restaurantId === restaurant.id.toString());
                    
                    return (
                      <TableRow key={restaurant.id}>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.description}</TableCell>
                        <TableCell>{restaurantPoints[restaurant.id] || '0'}</TableCell>
                        <TableCell>
                          {hasNFT ? (
                            nft.isRedeemed ? (
                              <Chip label="Redeemed" color="default" size="small" />
                            ) : (
                              <Chip 
                                label="Available" 
                                color="success" 
                                size="small"
                                onClick={() => {
                                  setSelectedNFT(nft);
                                  setOpenRedeemNFTDialog(true);
                                }}
                              />
                            )
                          ) : (
                            <Chip label="None" color="default" size="small" />
                          )}
                        </TableCell>
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
                    );
                  })}
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
          
          {/* View NFTs Dialog */}
          <Dialog 
            open={openNFTDialog} 
            onClose={() => setOpenNFTDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Your Welcome NFTs</DialogTitle>
            <DialogContent>
              {welcomeNFTs.length === 0 ? (
                <Typography variant="body1">
                  You don't have any welcome NFTs yet.
                </Typography>
              ) : (
                <List>
                  {welcomeNFTs.map((nft) => (
                    <ListItem key={nft.id} divider>
                      <ListItemText
                        primary={`${nft.restaurantName} Welcome NFT`}
                        secondary={`Free Merchandise: ${nft.merchandise}`}
                      />
                      <ListItemSecondaryAction>
                        {nft.isRedeemed ? (
                          <Chip label="Redeemed" color="default" size="small" />
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<RedeemIcon />}
                            onClick={() => {
                              setSelectedNFT(nft);
                              setOpenNFTDialog(false);
                              setOpenRedeemNFTDialog(true);
                            }}
                          >
                            Redeem
                          </Button>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenNFTDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
          
          {/* Redeem NFT Dialog */}
          <Dialog 
            open={openRedeemNFTDialog} 
            onClose={() => setOpenRedeemNFTDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Redeem Welcome NFT</DialogTitle>
            <DialogContent>
              {selectedNFT && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {selectedNFT.restaurantName} Welcome NFT
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You can redeem this NFT for:
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {selectedNFT.merchandise}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Once redeemed, you can visit the restaurant to claim your free merchandise.
                    Show this page to the restaurant staff as proof of redemption.
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRedeemNFTDialog(false)}>Cancel</Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={redeemWelcomeNFT}
                disabled={isLoading || !selectedNFT}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Redeem NFT'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}

export default CustomerDashboard;
