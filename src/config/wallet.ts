import * as CoboWaas2 from '@cobo/cobo-waas2';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally (for browser environments)
window.Buffer = Buffer;

export const SUPPORTED_CHAINS = {
  BTC: 'BTC',
  ETH: 'ETH',
  POLYGON: 'POLYGON',
};

export const NETWORK_NAMES = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  POLYGON: 'Polygon',
};

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.ETH;

// Get environment from .env file (default to 'dev')
const environment = import.meta.env.VITE_COBO_ENV || 'dev';

// Debugging: Check if CoboWaas2 is properly imported
console.log("CoboWaas2 Import:", Object.keys(CoboWaas2));

if (!CoboWaas2?.ApiClient) {
  throw new Error("CoboWaas2.ApiClient is undefined. Check package import.");
}

// Initialize API client
const apiClient = CoboWaas2.ApiClient.instance;

// Set environment (dev or prod)
if (environment === 'dev') {
  if (!CoboWaas2.Env) {
    throw new Error("CoboWaas2.Env is undefined.");
  }
  apiClient.setEnv(CoboWaas2.Env.DEV);
} else {
  apiClient.setEnv(CoboWaas2.Env.PROD);
}

// Get private key from environment variables
const privateKey = import.meta.env.VITE_COBO_API_PRIVATE_KEY;

if (!privateKey) {
  throw new Error('Missing required Cobo API private key');
}

try {
  apiClient.setPrivateKey(privateKey);
} catch (error) {
  console.error('Failed to initialize Cobo WaaS 2.0 SDK:', error);
  throw error;
}

// Find the correct Wallets API class
const walletApiClass = Object.keys(CoboWaas2).find(key => key.toLowerCase().includes('walletsapi'));

if (!walletApiClass) {
  throw new Error("No Wallets API class found in @cobo/cobo-waas2. Check package documentation.");
}

// Initialize Wallet API dynamically
const WalletsApi = CoboWaas2[walletApiClass];
const walletApi = new WalletsApi(apiClient);
console.log("Wallet API initialized:", walletApi);

// Function to generate a new wallet
export const createWallet = async () => {
  try {
    const opts = new CoboWaas2.CreateWalletParams();
    opts.wallet_type = CoboWaas2.WalletType.Custodial;
    opts.wallet_subtype = CoboWaas2.WalletSubtype.Asset;
    opts.chain_ids = ["BTC", "ETH"]; // Use an array if required

    const data = await walletApi.createWallet(opts);
    console.log("Wallet created successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to create wallet:", error);
    throw error;
  }
};

// Export API client and Wallet API instance
export { apiClient, walletApi };
