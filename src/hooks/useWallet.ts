import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { apiClient, walletApi, NETWORK_NAMES } from '../config/wallet';
import type { WalletState, TransactionRequest, PurchaseParams } from '../types';

// Initial state for wallet connection
const initialWalletState: WalletState = {
  connected: false,
  address: null,
  balance: null,
  chainId: null,
  network: null,
};

// Debugging: Check walletApi methods
console.log('walletApi methods:', Object.keys(walletApi || {}));
console.log('apiClient methods:', Object.keys(apiClient || {}));

// Ensure getWalletAddress exists
// if (!walletApi?.getWalletAddress) {
//   console.error('walletApi.getWalletAddress is missing!');
// }

if (!walletApi.getWalletAddress) {
  walletApi.getWalletAddress = async function () {
    // Implement logic to get wallet address
    return null; // Return address or null if not connected
  };
}


// Check if the wallet is connected
walletApi.isConnected = async function () {
  if (!this.getWalletAddress) {
    console.error('getWalletAddress method is missing in walletApi');
    return false;
  }
  return !!(await this.getWalletAddress());
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState);
  const [isInitializing, setIsInitializing] = useState(true);

  const updateWalletState = useCallback(async () => {
    try {
      if (!walletApi.getWalletAddress) {
        throw new Error("getWalletAddress method not found");
      }
  
      const address = await walletApi.getWalletAddress();
      if (!address) {
        throw new Error("No wallet address returned");
      }
  
      const chainId = await walletApi.getChainId();
      const balance = await walletApi.getBalance(address);
  
      setWalletState({
        connected: true,
        address,
        balance: ethers.formatEther(balance),
        chainId,
        network: NETWORK_NAMES[chainId] || "Unknown Network",
      });
    } catch (error) {
      console.error("Error updating wallet state:", error);
      setWalletState(initialWalletState);
    }
  }, []);
  

  // Initialize wallet connection on mount
  useEffect(() => {
    const init = async () => {
      try {
        const isConnected = await walletApi.isConnected?.();
        if (isConnected) {
          await updateWalletState();
        }
      } catch (error) {
        console.error('Wallet initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [updateWalletState]);

  // Connect Wallet
  const connectWallet = useCallback(async () => {
    try {
      await walletApi.connect?.();
      await updateWalletState();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
      setWalletState(initialWalletState);
    }
  }, [updateWalletState]);

  // Disconnect Wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await walletApi.disconnect?.();
      setWalletState(initialWalletState);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet. Please try again.');
    }
  }, []);

  // Sign & Send Transaction
  const signTransaction = useCallback(async (transaction: TransactionRequest) => {
    if (!walletState.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTx = await walletApi.signTransaction?.(transaction);
      if (!signedTx) throw new Error('Signing failed');

      const txHash = await walletApi.sendTransaction?.(signedTx);
      if (!txHash) throw new Error('Transaction failed to send');

      return txHash;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }, [walletState.connected]);

  // Purchase Art
  const purchaseArt = useCallback(async ({ artId, price, contractAddress, tokenId }: PurchaseParams) => {
    if (!walletState.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction: TransactionRequest = {
        to: contractAddress,
        value: ethers.parseEther(price).toString(),
        data: ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [tokenId]),
      };

      const txHash = await signTransaction(transaction);
      toast.success('Purchase successful! Transaction hash: ' + txHash);
      return txHash;
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Failed to complete purchase. Please try again.');
      throw error;
    }
  }, [walletState.connected, signTransaction]);

  return {
    walletState,
    isInitializing,
    connectWallet,
    disconnectWallet,
    signTransaction,
    purchaseArt,
  };
};
