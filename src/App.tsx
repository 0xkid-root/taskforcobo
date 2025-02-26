import React, { useState } from 'react';
import { ImageIcon, Palette } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { WalletConnect } from './components/WalletConnect';
import { ArtCard } from './components/ArtCard';
import type { ArtPiece } from './types';

const SAMPLE_ART: ArtPiece[] = [
  {
    id: '1',
    title: 'Digital Dreamscape',
    artist: 'CryptoArtist',
    description: 'A mesmerizing blend of digital art and traditional techniques.',
    price: '0.5',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=3000',
    contractAddress: '0x1234567890123456789012345678901234567890',
    tokenId: '1',
  },
  {
    id: '2',
    title: 'Abstract Harmony',
    artist: 'BlockchainBrush',
    description: 'An exploration of color and form in the digital age.',
    price: '0.8',
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=3000',
    contractAddress: '0x1234567890123456789012345678901234567890',
    tokenId: '2',
  },
  {
    id: '3',
    title: 'Cyber Renaissance',
    artist: 'NFTMaster',
    description: 'Where classical art meets cyberpunk aesthetics.',
    price: '1.2',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=3000',
    contractAddress: '0x1234567890123456789012345678901234567890',
    tokenId: '3',
  },
];

function App() {
  const [artworks] = useState<ArtPiece[]>(SAMPLE_ART);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  const handlePurchase = async (art: ArtPiece) => {
    try {
      setIsPurchasing(art.id);
      const { useWallet } = await import('./hooks/useWallet');
      const { purchaseArt } = useWallet();
      
      await purchaseArt({
        artId: art.id,
        price: art.price,
        contractAddress: art.contractAddress,
        tokenId: art.tokenId,
      });
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <WalletConnect />
      
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              NFT Art Marketplace
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <ArtCard 
              key={art.id} 
              art={art} 
              onPurchase={() => handlePurchase(art)}
              isPurchasing={isPurchasing === art.id}
            />
          ))}
        </div>

        {artworks.length === 0 && (
          <div className="text-center py-12">
            <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No artworks</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new listing.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;