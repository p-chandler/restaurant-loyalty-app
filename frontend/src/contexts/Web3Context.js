import React from 'react';
import { ethers } from 'ethers';

// Web3 connection context
const Web3Context = React.createContext({
  account: null,
  provider: null,
  signer: null,
  factoryContract: null,
  loyaltyContract: null,
  tokenContract: null,
  isConnected: false,
  isLoading: false,
  error: '',
  connectWallet: () => {},
});

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = React.useState('');
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [factoryContract, setFactoryContract] = React.useState(null);
  const [loyaltyContract, setLoyaltyContract] = React.useState(null);
  const [tokenContract, setTokenContract] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Contract ABIs and addresses
  const FACTORY_ADDRESS = '0xB34e549E359571E73843c753D29388Ec4e5E8FF5';
  const LOYALTY_ADDRESS = '0xaEc1165eb2AE7E17f2f1C571d66DBc331E1B55D7';
  const TOKEN_ADDRESS = '0x46C0b6161AB36932c1F0aAc971A3a434751fdc22';

  // Import ABIs
  const RestaurantLoyaltyFactoryABI = require('../contracts/RestaurantLoyaltyFactory.json');
  const RestaurantLoyaltyABI = require('../contracts/RestaurantLoyalty.json');
  const RestaurantLoyaltyTokenABI = require('../contracts/RestaurantLoyaltyToken.json');

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setAccount(account);
      
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      
      const signer = provider.getSigner();
      setSigner(signer);
      
      // Create contract instances
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, RestaurantLoyaltyFactoryABI, signer);
      setFactoryContract(factoryContract);
      
      const loyaltyContract = new ethers.Contract(LOYALTY_ADDRESS, RestaurantLoyaltyABI, signer);
      setLoyaltyContract(loyaltyContract);
      
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, RestaurantLoyaltyTokenABI, signer);
      setTokenContract(tokenContract);
      
      setIsConnected(true);
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
      
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if already connected on mount
  React.useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        factoryContract,
        loyaltyContract,
        tokenContract,
        isConnected,
        isLoading,
        error,
        connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => React.useContext(Web3Context);

export default Web3Context;
