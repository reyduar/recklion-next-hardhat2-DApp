"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from "@heroui/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther } from "viem";
import MarketplaceABI from "@/abis/Marketplace.json";
import { NFTCard } from "@/components/marketplace/NFTCard";

export default function MarketplacePage() {
  const { address } = useAccount();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMounted, setIsMounted] = useState(false);

  const marketplaceAddress = process.env
    .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;
  const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`;
  const pinataGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY as string;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Leer itemCount del marketplace
  const {
    data: itemCount,
    isLoading: isLoadingCount,
    refetch: refetchItemCount,
  } = useReadContract({
    address: marketplaceAddress,
    abi: MarketplaceABI.abi,
    functionName: "itemCount",
    query: {
      enabled: !!marketplaceAddress,
      refetchInterval: 10_000,
    },
  });

  const {
    data: txHash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Cuando se confirma la compra, recargar items
  useEffect(() => {
    if (isSuccess) {
      setIsPurchasing(false);
      onClose();
      addToast({
        title: "¡Compra exitosa!",
        description: "El NFT ahora es tuyo",
        color: "success",
      });
      refetchItemCount();
    }
  }, [isSuccess]);

  // Mostrar errores
  useEffect(() => {
    if (writeError) {
      console.error("Error:", writeError);
      addToast({
        title: "Error en la compra",
        description: writeError.message,
        color: "danger",
      });
      setIsPurchasing(false);
    }
  }, [writeError]);

  // Función para comprar NFT
  const handlePurchase = (item: any) => {
    setSelectedItem(item);
    onOpen();
  };

  const confirmPurchase = async () => {
    if (!selectedItem) return;

    setIsPurchasing(true);
    try {
      writeContract({
        address: marketplaceAddress,
        abi: MarketplaceABI.abi,
        functionName: "purchaseItem",
        args: [selectedItem.itemId],
        value: selectedItem.totalPrice,
      });
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      setIsPurchasing(false);
    }
  };

  // Generar array de itemIds para renderizar
  const itemIds = itemCount
    ? Array.from({ length: Number(itemCount) }, (_, i) => i + 1)
    : [];

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
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-400 mt-1">
            Descubre, compra y vende NFTs únicos
          </p>
        </div>
        <ConnectButton />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/marketplace/create"
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
        >
          <span className="text-4xl">✨</span>
          <span className="text-lg font-semibold">Crear NFT</span>
        </Link>

        <Link
          href="/marketplace/products"
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
        >
          <span className="text-4xl">🛍️</span>
          <span className="text-lg font-semibold">Mis Productos</span>
        </Link>

        <Link
          href="/marketplace/purchases"
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
        >
          <span className="text-4xl">📦</span>
          <span className="text-lg font-semibold">Mis Compras</span>
        </Link>
      </div>

      {/* NFTs Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">NFTs Disponibles</h2>

        {isLoadingCount ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Spinner size="lg" label="Cargando NFTs..." />
          </div>
        ) : itemIds.length === 0 ? (
          <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
            <span className="text-6xl mb-4 block">🎨</span>
            <p className="text-xl text-gray-400">
              No hay NFTs disponibles en este momento
            </p>
            <Link href="/marketplace/create">
              <Button color="primary" className="mt-4">
                Crear el primero
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemIds.map((itemId) => (
              <NFTCard
                key={itemId}
                itemId={itemId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                pinataGateway={pinataGateway}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de compra */}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirmar Compra
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
              <div className="space-y-4">
                {selectedItem.metadata?.image && (
                  <img
                    src={selectedItem.metadata.image}
                    alt={selectedItem.metadata.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedItem.metadata?.name ||
                      `NFT #${selectedItem.tokenId}`}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedItem.metadata?.description}
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Precio total</p>
                  <p className="text-2xl font-bold">
                    {formatEther(selectedItem.totalPrice)} ETH
                  </p>
                </div>
                {(isPurchasing || isWritePending || isConfirming) && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" />
                      <p className="text-sm text-blue-300">
                        {isWritePending
                          ? "Esperando confirmación..."
                          : "Procesando compra..."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              isDisabled={isPurchasing || isWritePending || isConfirming}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={confirmPurchase}
              isDisabled={isPurchasing || isWritePending || isConfirming}
            >
              Confirmar Compra
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
