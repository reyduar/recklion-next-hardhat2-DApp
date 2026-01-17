"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Spinner, Chip } from "@heroui/react";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import NFTABI from "@/abis/NFT.json";

interface PurchasedNFTCardProps {
  tokenId: bigint;
  price: bigint;
  itemId: bigint;
  nftAddress: `0x${string}`;
  pinataGateway: string;
}

export const PurchasedNFTCard: React.FC<PurchasedNFTCardProps> = ({
  tokenId,
  price,
  itemId,
  nftAddress,
  pinataGateway,
}) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Leer tokenURI
  const { data: tokenURI } = useReadContract({
    address: nftAddress,
    abi: NFTABI.abi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  // Cargar metadata cuando tengamos tokenURI
  useEffect(() => {
    const loadMetadata = async () => {
      if (!tokenURI) return;

      try {
        const uri = tokenURI as string;
        let metadataUrl = uri;

        // Convertir IPFS a HTTP
        if (uri.startsWith("ipfs://")) {
          const cid = uri.replace("ipfs://", "");
          metadataUrl = `https://${pinataGateway}/ipfs/${cid}`;
        }

        const response = await fetch(metadataUrl);
        const data = await response.json();

        // Convertir imagen IPFS a HTTP
        if (data.image && data.image.startsWith("ipfs://")) {
          const imageCid = data.image.replace("ipfs://", "");
          data.image = `https://${pinataGateway}/ipfs/${imageCid}`;
        }

        setMetadata(data);
      } catch (error) {
        console.error("Error loading metadata:", error);
      } finally {
        setLoadingMetadata(false);
      }
    };

    loadMetadata();
  }, [tokenURI, pinataGateway]);

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardBody className="p-0">
        {/* Image */}
        <div className="relative w-full h-64 bg-gray-800 overflow-hidden">
          {loadingMetadata ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : metadata?.image ? (
            <img
              src={metadata.image}
              alt={metadata.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              🖼️
            </div>
          )}

          {/* Badge de comprado */}
          <div className="absolute top-2 right-2">
            <Chip color="success" variant="solid" size="sm">
              ✓ Comprado
            </Chip>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">
            {metadata?.name || `NFT #${tokenId.toString()}`}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {metadata?.description || "Sin descripción"}
          </p>
        </div>
      </CardBody>

      <CardFooter className="border-t border-gray-800 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Precio pagado</p>
          <p className="text-xl font-bold">{formatEther(price)} ETH</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Item ID</p>
          <p className="text-sm font-mono">#{itemId.toString()}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
