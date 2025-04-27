// Contract configuration for the restaurant loyalty app
const config = {
  // Contract addresses on Moonbase Alpha testnet
  contractAddresses: {
    token: "0x67B152592426AACeaa0692AeB42D048150B8D0c4",
    nft: "0x27A2e33E1F13863E64BDc5bc04deCA4A9875231c",
    loyalty: "0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7"
  },
  
  // Network configuration
  network: {
    chainId: "0x507", // 1287 in hex
    chainName: "Moonbase Alpha",
    rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
    nativeCurrency: {
      name: "DEV",
      symbol: "DEV",
      decimals: 18
    },
    blockExplorerUrls: ["https://moonbase.moonscan.io/"]
  }
};

export default config;
