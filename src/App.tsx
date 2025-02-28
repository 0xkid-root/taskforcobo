import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { WalletConnect } from "./components/WalletConnect";
import { ArtCard } from "./components/ArtCard";
import Navbar from "./Navbar";

// Pinata Gateway URL
const PINATA_GATEWAY_URL = "https://indigo-imperial-crawdad-414.mypinata.cloud/ipfs/";
const CID = "bafybeicxzielubdg6gmqwvzgktctow75tkrm472rssdhyh5lmiourwkhti"; // Your CID

const getPinataUrl = (uri) => {
  if (uri.startsWith("ipfs://")) {
    return `${PINATA_GATEWAY_URL}${uri.split("ipfs://")[1]}`;
  }
  return uri;
};

const fetchImagesFromCID = async () => {
  let images = [];

  for (let i = 1; i <= 10; i++) {
    try {
      const response = await fetch(getPinataUrl(`ipfs://${CID}/${i}`));
      if (!response.ok) continue;

      const jsonData = await response.json();
      console.log(`Fetched metadata for NFT #${i}:`, jsonData);

      images.push({
        title: jsonData.name || `NFT #${i}`,
        description: jsonData.description || "No description available",
        imageUrl: getPinataUrl(jsonData.image),
        price: jsonData.price || "0.05",
        artist: jsonData.artist || "Unknown",
        attributes: jsonData.attributes || [],
      });
    } catch (error) {
      console.error(`Error fetching ${i}.json`, error);
    }
  }

  return images;
};

function App() {
  const [images, setImages] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      const pinataImages = await fetchImagesFromCID();
      setImages(pinataImages);
    };

    loadImages();
  }, []);

  const handlePurchase = (art) => {
    setIsPurchasing(true);
    console.log(`Purchasing ${art.title} for ${art.price} ETH...`);
    setTimeout(() => {
      setIsPurchasing(false);
      alert(`✅ Purchase Successful: ${art.title}`);
    }, 2000);
  };

  return (
    <div>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4 flex justify-between items-center">
        <WalletConnect /> {/* Wallet Connect stays on the left */}
        <h1 className="text-2xl md:text-3xl font-bold text-right">NFT Marketplace</h1>
      </div>

      {/* Spacing for content below the fixed navbar */}
      <div className="pt-24 p-5">
        <Toaster />

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((art, index) => (
            <ArtCard
              key={index}
              art={art}
              onPurchase={() => handlePurchase(art)}
              isPurchasing={isPurchasing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
