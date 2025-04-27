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
  nftContract: null,
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
  const [nftContract, setNftContract] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Contract ABIs and addresses
  const FACTORY_ADDRESS = '0xB34e549E359571E73843c753D29388Ec4e5E8FF5';
  const LOYALTY_ADDRESS = '0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7';
  const TOKEN_ADDRESS = '0x67B152592426AACeaa0692AeB42D048150B8D0c4';
  const NFT_ADDRESS = '0x27A2e33E1F13863E64BDc5bc04deCA4A9875231c';

  // Import ABIs
  const RestaurantLoyaltyFactoryABI = require('../contracts/RestaurantLoyaltyFactory.json');
  const RestaurantLoyaltyABI = require('../contracts/RestaurantLoyalty.json');
  const RestaurantLoyaltyTokenABI = require('../contracts/RestaurantLoyaltyToken.json');
  const RestaurantWelcomeNFTABI = require('../contracts/RestaurantWelcomeNFT.json');

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
      
      const nftContract = new ethers.Contract(NFT_ADDRESS, RestaurantWelcomeNFTABI, signer);
      setNftContract(nftContract);
      
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
        nftContract,
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
