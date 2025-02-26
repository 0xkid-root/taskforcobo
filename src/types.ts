export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: string;
  imageUrl: string;
  contractAddress: string;
  tokenId: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  network: string | null;
}

export interface TransactionRequest {
  to: string;
  value: string;
  data: string;
}

export interface PurchaseParams {
  artId: string;
  price: string;
  contractAddress: string;
  tokenId: string;
}