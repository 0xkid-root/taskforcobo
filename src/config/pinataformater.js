export const getPinataUrl = (uri) => {
  if (uri.startsWith("ipfs://")) {
    return `https://indigo-imperial-crawdad-414.mypinata.cloud/ipfs/${uri.split("ipfs://")[1]}`;
  }
  return uri;
};
