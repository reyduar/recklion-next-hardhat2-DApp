"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Button, Spinner } from "@heroui/react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import MarketplaceABI from "@/abis/Marketplace.json";
import NFTABI from "@/abis/NFT.json";

interface NFTCardProps {
  itemId: number;
  marketplaceAddress: `0x${string}`;
  nftAddress: `0x${string}`;
  pinataGateway: string;
  onPurchase: (item: any) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  itemId,
  marketplaceAddress,
  nftAddress,
  pinataGateway,
  onPurchase,
}) => {
  const { address } = useAccount();
  const [metadata, setMetadata] = useState<any>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Leer datos del item
  const { data: itemData, isLoading: isLoadingItem } = useReadContract({
    address: marketplaceAddress,
    abi: MarketplaceABI.abi,
    functionName: "items",
    args: [BigInt(itemId)],
    query: {
      refetchInterval: 5_000, // Refrescar cada 5 segundos
    },
  });

  // Leer precio total
  const { data: totalPrice, isLoading: isLoadingPrice } = useReadContract({
    address: marketplaceAddress,
    abi: MarketplaceABI.abi,
    functionName: "getTotalPrice",
    args: [BigInt(itemId)],
    query: {
      refetchInterval: 5_000, // Refrescar cada 5 segundos
    },
  });

  // Extraer datos del item
  const item = itemData as
    | [bigint, string, bigint, bigint, string, boolean]
    | undefined;
  const [id, nft, tokenId, price, seller, sold] = item || [];

  // Leer tokenURI
  const { data: tokenURI } = useReadContract({
    address: nftAddress,
    abi: NFTABI.abi,
    functionName: "tokenURI",
    args: [tokenId],
    query: {
      enabled: !!tokenId,
    },
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

  // Si está cargando, mostrar spinner
  if (isLoadingItem || isLoadingPrice) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-0">
          <div className="relative w-full h-64 bg-gray-800 overflow-hidden flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        </CardBody>
      </Card>
    );
  }

  // Si no hay datos del item, no mostrar
  if (!itemData || !seller) {
    return null;
  }

  // Si el item está vendido, no mostrar
  if (sold) {
    return null;
  }

  const handlePurchase = () => {
    onPurchase({
      itemId: BigInt(itemId),
      nftAddress: nft,
      tokenId,
      price,
      seller,
      sold,
      totalPrice,
      metadata,
    });
  };

  return (
    <Card className="bg-gray-900/50 border border-gray-800 hover:border-gray-600 transition-all">
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
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">
            {metadata?.name || `NFT #${tokenId}`}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {metadata?.description || "Sin descripción"}
          </p>

          {/* Seller */}
          <p className="text-xs text-gray-500 mt-2">
            Vendedor: {seller?.slice(0, 6)}...{seller?.slice(-4)}
          </p>
        </div>
      </CardBody>

      <CardFooter className="border-t border-gray-800 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Precio</p>
          <p className="text-xl font-bold">
            {totalPrice ? formatEther(totalPrice as bigint) : "..."} ETH
          </p>
        </div>
        <Button
          color="primary"
          size="lg"
          onPress={handlePurchase}
          isDisabled={seller === address}
        >
          {seller === address ? "Tu NFT" : "Comprar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
