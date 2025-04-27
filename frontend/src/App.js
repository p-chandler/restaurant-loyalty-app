import React from 'react';
import { Web3Provider, useWeb3 } from './contexts/Web3Context';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, 
  Card, CardContent, Grid, TextField, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

// Components
import Home from './components/Home';
import RestaurantDashboard from './components/RestaurantDashboard';
import CustomerDashboard from './components/CustomerDashboard';

function App() {
  const { 
    account, 
    isConnected, 
    isLoading, 
    error, 
    connectWallet 
  } = useWeb3();

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Restaurant Loyalty Program
            </Typography>
            {!isConnected ? (
              <Button 
                color="inherit" 
                onClick={connectWallet}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Connect Wallet'}
              </Button>
            ) : (
              <Typography variant="body2">
                Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/restaurant-dashboard" 
              element={
                isConnected ? 
                <RestaurantDashboard /> : 
                <Navigate to="/" />
              } 
            />
            <Route 
              path="/customer-dashboard" 
              element={
                isConnected ? 
                <CustomerDashboard /> : 
                <Navigate to="/" />
              } 
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

// Wrap the App with Web3Provider
function AppWithWeb3() {
  return (
    <Web3Provider>
      <App />
    </Web3Provider>
  );
}

export default AppWithWeb3;
