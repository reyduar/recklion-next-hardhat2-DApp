"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Spinner, Chip } from "@heroui/react";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import NFTABI from "@/abis/NFT.json";

interface ProductNFTCardProps {
  itemId: bigint;
  tokenId: bigint;
  price: bigint;
  totalPrice: bigint;
  sold: boolean;
  nftAddress: `0x${string}`;
  pinataGateway: string;
  feePercent: number;
}

export const ProductNFTCard: React.FC<ProductNFTCardProps> = ({
  itemId,
  tokenId,
  price,
  totalPrice,
  sold,
  nftAddress,
  pinataGateway,
  feePercent,
}) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Calcular lo que recibimos (precio sin fee)
  const receivedAmount = price;
  const feeAmount = totalPrice - price;

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
    <Card
      className={`${
        sold
          ? "bg-gray-900/30 border-2 border-green-500/30"
          : "bg-gray-900/50 border border-blue-500/30"
      }`}
    >
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
              className={`w-full h-full object-cover ${
                sold ? "opacity-60" : ""
              }`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              🖼️
            </div>
          )}

          {/* Badge */}
          <div className="absolute top-2 right-2">
            {sold ? (
              <Chip color="success" variant="solid" size="lg">
                ✓ VENDIDO
              </Chip>
            ) : (
              <Chip color="primary" variant="solid" size="sm">
                🔵 En Venta
              </Chip>
            )}
          </div>

          {/* Token ID */}
          <div className="absolute top-2 left-2">
            <Chip variant="solid" size="sm" className="bg-black/60">
              Token #{tokenId.toString()}
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

      <CardFooter className="border-t border-gray-800 flex flex-col gap-3 p-4">
        {sold ? (
          // Vista de vendido
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Precio de venta:</span>
              <span className="text-lg font-bold text-green-400">
                {formatEther(totalPrice)} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Recibiste:</span>
              <span className="text-md font-semibold text-green-300">
                {formatEther(receivedAmount)} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Fee ({feePercent}%):
              </span>
              <span className="text-xs text-gray-500">
                {formatEther(feeAmount)} ETH
              </span>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-center text-gray-500">
                Item #{itemId.toString()}
              </p>
            </div>
          </div>
        ) : (
          // Vista en venta
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Precio listado:</span>
              <span className="text-xl font-bold text-blue-400">
                {formatEther(price)} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Precio total:</span>
              <span className="text-sm text-gray-300">
                {formatEther(totalPrice)} ETH
              </span>
            </div>
            <div className="pt-2 border-t border-gray-700 mt-2">
              <p className="text-xs text-center text-gray-500">
                Item #{itemId.toString()}
              </p>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
