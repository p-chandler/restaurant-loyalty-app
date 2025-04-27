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
      if (!account) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        // For hackathon demo: Skip blockchain interaction and check if user is already registered in local storage
        const storedIsRegistered = localStorage.getItem('demo_isRegistered');
        const storedCustomerName = localStorage.getItem('demo_customerName');
        
        if (storedIsRegistered === 'true' && storedCustomerName) {
          // Load demo data from local storage
          const mockCustomerInfo = {
            name: storedCustomerName,
            isRegistered: true
          };
          
          setCustomerInfo(mockCustomerInfo);
          setIsRegistered(true);
          setTotalPoints(localStorage.getItem('demo_totalPoints') || '500');
          
          // Use the restaurants from the Home page
          const demoRestaurants = [
            {
              id: 1,
              name: "Pixel Bistro",
              description: "A modern fusion restaurant with tech-inspired ambiance",
              merchandise: "Exclusive branded coffee mug",
              owner: account
            },
            {
              id: 2,
              name: "Blockchain Brewery",
              description: "Craft beer and pub food in a blockchain-themed setting",
              merchandise: "Limited edition t-shirt",
              owner: account
            },
            {
              id: 3,
              name: "Crypto Café",
              description: "Cozy café serving specialty coffees in a crypto-friendly environment",
              merchandise: "Reusable coffee cup",
              owner: account
            },
            {
              id: 4,
              name: "Web3 Wok",
              description: "Asian fusion restaurant celebrating decentralized technology",
              merchandise: "Signature recipes cookbook",
              owner: account
            },
            {
              id: 5,
              name: "Metaverse Munchies",
              description: "Fast-casual dining with a virtual reality twist",
              merchandise: "VR dining experience voucher",
              owner: account
            }
          ];
          
          setRestaurants(demoRestaurants);
          
          // Load points from local storage or use defaults
          try {
            const storedPoints = JSON.parse(localStorage.getItem('demo_restaurantPoints') || '{}');
            setRestaurantPoints(storedPoints.length > 0 ? storedPoints : {
              1: '200',
              2: '150',
              3: '100',
              4: '50',
              5: '0'
            });
          } catch (e) {
            // Use default points if parsing fails
            setRestaurantPoints({
              1: '200',
              2: '150',
              3: '100',
              4: '50',
              5: '0'
            });
          }
          
          // Load NFTs from local storage or use defaults
          try {
            const storedNFTs = JSON.parse(localStorage.getItem('demo_welcomeNFTs') || '[]');
            setWelcomeNFTs(storedNFTs.length > 0 ? storedNFTs : [
              {
                id: '1',
                restaurantId: '1',
                restaurantName: "Pixel Bistro",
                merchandise: "Exclusive branded coffee mug",
                isRedeemed: false
              }
            ]);
          } catch (e) {
            // Use default NFT if parsing fails
            setWelcomeNFTs([
              {
                id: '1',
                restaurantId: '1',
                restaurantName: "Pixel Bistro",
                merchandise: "Exclusive branded coffee mug",
                isRedeemed: false
              }
            ]);
          }
        } else {
          setIsRegistered(false);
          
          // Still load restaurants for registration
          const demoRestaurants = [
            {
              id: 1,
              name: "Pixel Bistro",
              description: "A modern fusion restaurant with tech-inspired ambiance",
              merchandise: "Exclusive branded coffee mug",
              owner: account
            },
            {
              id: 2,
              name: "Blockchain Brewery",
              description: "Craft beer and pub food in a blockchain-themed setting",
              merchandise: "Limited edition t-shirt",
              owner: account
            },
            {
              id: 3,
              name: "Crypto Café",
              description: "Cozy café serving specialty coffees in a crypto-friendly environment",
              merchandise: "Reusable coffee cup",
              owner: account
            },
            {
              id: 4,
              name: "Web3 Wok",
              description: "Asian fusion restaurant celebrating decentralized technology",
              merchandise: "Signature recipes cookbook",
              owner: account
            },
            {
              id: 5,
              name: "Metaverse Munchies",
              description: "Fast-casual dining with a virtual reality twist",
              merchandise: "VR dining experience voucher",
              owner: account
            }
          ];
          
          setRestaurants(demoRestaurants);
        }
        
      } catch (error) {
        console.error('Error loading customer data:', error);
        setError('Failed to load customer data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomerData();
  }, [account]);
  
  // Register customer
  const registerCustomer = async () => {
    if (!customerName) {
      setError('Please enter your name');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // For hackathon demo: Skip blockchain interaction and simulate successful registration
      setSuccess('Registration successful! You received a welcome NFT!');
      
      // Simulate customer data
      const mockCustomerInfo = {
        name: customerName,
        isRegistered: true
      };
      
      setCustomerInfo(mockCustomerInfo);
      setIsRegistered(true);
      
      // Simulate points and NFTs for demo
      setTotalPoints('500');
      
      // Use the restaurants from the Home page
      const demoRestaurants = [
        {
          id: 1,
          name: "Pixel Bistro",
          description: "A modern fusion restaurant with tech-inspired ambiance",
          merchandise: "Exclusive branded coffee mug",
          owner: account
        },
        {
          id: 2,
          name: "Blockchain Brewery",
          description: "Craft beer and pub food in a blockchain-themed setting",
          merchandise: "Limited edition t-shirt",
          owner: account
        },
        {
          id: 3,
          name: "Crypto Café",
          description: "Cozy café serving specialty coffees in a crypto-friendly environment",
          merchandise: "Reusable coffee cup",
          owner: account
        },
        {
          id: 4,
          name: "Web3 Wok",
          description: "Asian fusion restaurant celebrating decentralized technology",
          merchandise: "Signature recipes cookbook",
          owner: account
        },
        {
          id: 5,
          name: "Metaverse Munchies",
          description: "Fast-casual dining with a virtual reality twist",
          merchandise: "VR dining experience voucher",
          owner: account
        }
      ];
      
      setRestaurants(demoRestaurants);
      
      // Simulate points for each restaurant
      const demoPoints = {
        1: '200',
        2: '150',
        3: '100',
        4: '50',
        5: '0'
      };
      
      setRestaurantPoints(demoPoints);
      
      // Simulate NFTs
      const selectedRestId = selectedRestaurantForNFT || '1';
      const selectedRest = demoRestaurants.find(r => r.id.toString() === selectedRestId) || demoRestaurants[0];
      
      const demoNFTs = [
        {
          id: '1',
          restaurantId: selectedRestId,
          restaurantName: selectedRest.name,
          merchandise: selectedRest.merchandise,
          isRedeemed: false
        }
      ];
      
      setWelcomeNFTs(demoNFTs);
      
      // Save to localStorage for persistence
      localStorage.setItem('demo_isRegistered', 'true');
      localStorage.setItem('demo_customerName', customerName);
      localStorage.setItem('demo_totalPoints', '500');
      localStorage.setItem('demo_restaurantPoints', JSON.stringify(demoPoints));
      localStorage.setItem('demo_welcomeNFTs', JSON.stringify(demoNFTs));
      
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
    if (!selectedRestaurant || !pointsToRedeem) {
      setError('Please select a restaurant and enter points to redeem');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // For hackathon demo: Skip blockchain interaction and simulate successful redemption
      setSuccess('Points redeemed successfully!');
      
      // Update points for the selected restaurant
      const currentPoints = parseInt(restaurantPoints[selectedRestaurant] || '0');
      const pointsToRedeemNum = parseInt(pointsToRedeem);
      
      if (pointsToRedeemNum > currentPoints) {
        setError('You don\'t have enough points to redeem.');
        setIsLoading(false);
        return;
      }
      
      // Update points
      const newPoints = (currentPoints - pointsToRedeemNum).toString();
      const updatedRestaurantPoints = {
        ...restaurantPoints,
        [selectedRestaurant]: newPoints
      };
      
      setRestaurantPoints(updatedRestaurantPoints);
      
      // Update total points
      const newTotalPoints = (parseInt(totalPoints) - pointsToRedeemNum).toString();
      setTotalPoints(newTotalPoints);
      
      // Save to localStorage for persistence
      localStorage.setItem('demo_totalPoints', newTotalPoints);
      localStorage.setItem('demo_restaurantPoints', JSON.stringify(updatedRestaurantPoints));
      
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
    if (!selectedNFT) {
      setError('Please select an NFT to redeem');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // For hackathon demo: Skip blockchain interaction and simulate successful NFT redemption
      setSuccess('NFT redeemed successfully! You can now claim your free merchandise.');
      
      // Update NFT status
      const updatedNFTs = welcomeNFTs.map(nft => 
        nft.id === selectedNFT.id ? { ...nft, isRedeemed: true } : nft
      );
      
      setWelcomeNFTs(updatedNFTs);
      
      // Save to localStorage for persistence
      localStorage.setItem('demo_welcomeNFTs', JSON.stringify(updatedNFTs));
      
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
