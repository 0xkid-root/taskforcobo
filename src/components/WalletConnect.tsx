import React, { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { Button } from './ui/button';
import {createWallet} from "../config/wallet"
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

export const WalletConnect: React.FC = () => {
  const { walletState, isInitializing, connectWallet, disconnectWallet } = useWallet();

  const [walletData, setWalletData] = useState(null);

  const handleCreateWallet = async () => {
    try {
      const wallet = await createWallet();
      console.log("wallet is here",wallet)
      setWalletData(wallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  if (isInitializing) {
    return (
      <div className="fixed top-4 right-4">
        <Button variant="outline" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initializing...
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4">
      {!walletState.connected ? (
        <Button onClick={handleCreateWallet} className="shadow-lg">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet 
        </Button>
      ) : (
        <div className="flex flex-col items-end gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline" className="shadow-sm">
                <Wallet className="mr-2 h-4 w-4" />
                {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Connected Address:</p>
                <p className="text-sm font-mono">{walletState.address}</p>
                <p className="text-sm text-muted-foreground">Network:</p>
                <p className="text-sm font-mono">{walletState.network}</p>
                <p className="text-sm text-muted-foreground">Balance:</p>
                <p className="text-sm font-mono">{walletState.balance} ETH</p>
              </div>
            </HoverCardContent>
          </HoverCard>
          <Button 
            variant="outline" 
            size="sm"
            onClick={disconnectWallet}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};