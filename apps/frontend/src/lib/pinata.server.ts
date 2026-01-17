import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

export const ipfsUri = (cid: string) => `ipfs://${cid}`;
export const gatewayUrl = (cid: string) =>
  `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${cid}`;
