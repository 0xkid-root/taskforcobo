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
console.log("CoboWaas2 Import:", CoboWaas2);

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

// Ensure WalletsApi exists
if (!CoboWaas2.WalletsApi) {
  throw new Error("CoboWaas2.WalletsApi is undefined. Check package import.");
}

// Initialize Wallet API
const walletApi = new CoboWaas2.WalletsApi();
console.log("Wallet API initialized:", walletApi);

// Function to generate a new wallet
export const createWallet = async () => {
  try {
    const opts = { CreateWalletParams: new CoboWaas2.CreateWalletParams() };
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
