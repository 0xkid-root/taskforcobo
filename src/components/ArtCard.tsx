import React from 'react';
import { Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { Button } from './ui/button';
import type { ArtPiece } from '../types';

interface ArtCardProps {
  art: ArtPiece;
  onPurchase: () => void;
  isPurchasing: boolean;
}

export const ArtCard: React.FC<ArtCardProps> = ({ art, onPurchase, isPurchasing }) => {
  const { walletState } = useWallet();

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        <img
          src={art.imageUrl}
          alt={art.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{art.title}</h3>
          <p className="text-sm text-muted-foreground">by {art.artist}</p>
        </div>
        <p className="mb-4 text-sm text-gray-600">{art.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">{art.price}</span>
            <span className="text-sm text-muted-foreground">ETH</span>
          </div>
          <Button
            onClick={onPurchase}
            disabled={!walletState.connected || isPurchasing}
            variant={walletState.connected ? "default" : "secondary"}
            className="relative"
          >
            {isPurchasing && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isPurchasing
              ? 'Processing...'
              : walletState.connected
              ? 'Purchase'
              : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  );
};