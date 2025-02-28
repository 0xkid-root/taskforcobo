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
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      {/* NFT Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={art.imageUrl}
          alt={art.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{art.title}</h3>
        <p className="text-sm text-gray-500">by {art.artist}</p>

        {/* NFT Description */}
        <p className="mt-2 text-sm md:text-base text-gray-700">{art.description}</p>

        {/* Attributes Section */}
        <div className="mt-3">
          <h4 className="text-sm font-bold text-gray-800">Attributes:</h4>
          <ul className="mt-1 flex flex-wrap gap-2">
            {art.attributes.map((attr, index) => (
              <li
                key={index}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
              >
                {attr.trait_type}: {attr.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Price & Purchase Button */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold text-primary">{art.price}</span>
            <span className="text-sm text-gray-500">ETH</span>
          </div>

          <Button
            onClick={onPurchase}
            disabled={!walletState.connected || isPurchasing}
            variant={walletState.connected ? 'default' : 'secondary'}
            className="relative px-4 py-2 text-sm md:text-base"
          >
            {isPurchasing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : walletState.connected ? (
              'Purchase'
            ) : (
              'Connect Wallet'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
