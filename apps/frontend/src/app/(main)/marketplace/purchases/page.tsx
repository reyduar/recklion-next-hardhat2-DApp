"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Spinner, Card, CardBody } from "@heroui/react";
import { useAccount, usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import MarketplaceABI from "@/abis/Marketplace.json";
import { PurchasedNFTCard } from "@/components/marketplace/PurchasedNFTCard";

interface Purchase {
  itemId: bigint;
  tokenId: bigint;
  price: bigint;
  blockNumber: bigint;
}

export default function PurchasesPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const marketplaceAddress = process.env
    .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;
  const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`;
  const pinataGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY as string;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar compras cuando se conecta la wallet
  useEffect(() => {
    if (isConnected && address && publicClient) {
      loadPurchases();
    }
  }, [isConnected, address, publicClient]);

  const loadPurchases = async () => {
    if (!address || !publicClient) return;

    setLoading(true);
    try {
      // Obtener eventos Bought donde el buyer es la cuenta actual
      const logs = await publicClient.getLogs({
        address: marketplaceAddress,
        event: parseAbiItem(
          "event Bought(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address indexed seller, address indexed buyer)"
        ),
        args: {
          buyer: address,
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      });

      console.log("📦 Eventos Bought encontrados:", logs);

      // Extraer información de cada compra
      const purchasesList: Purchase[] = logs.map((log) => {
        // Los args vienen en orden: itemId, nft, tokenId, price, seller, buyer
        const itemId = log.args.itemId as bigint;
        const tokenId = log.args.tokenId as bigint;
        const price = log.args.price as bigint;

        return {
          itemId,
          tokenId,
          price,
          blockNumber: log.blockNumber,
        };
      });

      // Ordenar por blockNumber descendente (más recientes primero)
      purchasesList.sort((a, b) => (a.blockNumber > b.blockNumber ? -1 : 1));

      console.log("✅ Compras procesadas:", purchasesList);
      setPurchases(purchasesList);
    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Compras</h1>
          <p className="text-gray-400 mt-1">
            NFTs que has adquirido en el marketplace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="bordered">← Volver al Marketplace</Button>
          </Link>
          <ConnectButton />
        </div>
      </div>

      {/* Stats Card */}
      {isConnected && purchases.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total de NFTs comprados</p>
                <p className="text-4xl font-bold text-blue-400 mt-1">
                  {purchases.length}
                </p>
              </div>
              <div className="text-6xl opacity-50">🛒</div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Content */}
      {!isConnected ? (
        <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
          <span className="text-6xl mb-4 block">🔒</span>
          <p className="text-xl text-gray-400">
            Conecta tu wallet para ver tus compras
          </p>
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-400">Cargando tus compras...</p>
          </div>
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
          <span className="text-6xl mb-4 block">📦</span>
          <p className="text-xl text-gray-400 mb-2">
            Aún no has comprado ningún NFT
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Explora el marketplace y encuentra NFTs únicos
          </p>
          <Link href="/marketplace">
            <Button color="primary">Explorar Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Tus NFTs ({purchases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <PurchasedNFTCard
                key={`${purchase.itemId}-${index}`}
                itemId={purchase.itemId}
                tokenId={purchase.tokenId}
                price={purchase.price}
                nftAddress={nftAddress}
                pinataGateway={pinataGateway}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
