"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Spinner, Card, CardBody, Tabs, Tab } from "@heroui/react";
import { useAccount, useReadContract } from "wagmi";
import MarketplaceABI from "@/abis/Marketplace.json";
import { ProductNFTCard } from "@/components/marketplace/ProductNFTCard";

interface ProductItem {
  itemId: bigint;
  tokenId: bigint;
  price: bigint;
  totalPrice: bigint;
  sold: boolean;
}

export default function ProductsPage() {
  const { address, isConnected } = useAccount();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const marketplaceAddress = process.env
    .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;
  const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`;
  const pinataGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY as string;

  // Leer itemCount del marketplace
  const { data: itemCount, isLoading: isLoadingCount } = useReadContract({
    address: marketplaceAddress,
    abi: MarketplaceABI.abi,
    functionName: "itemCount",
  });

  // Leer feePercent
  const { data: feePercent } = useReadContract({
    address: marketplaceAddress,
    abi: MarketplaceABI.abi,
    functionName: "feePercent",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar productos cuando tengamos itemCount y address
  useEffect(() => {
    if (itemCount && address) {
      loadProducts();
    }
  }, [itemCount, address]);

  const loadProducts = async () => {
    if (!itemCount || !address) return;

    const count = Number(itemCount);
    const myProducts: ProductItem[] = [];

    // Leer cada item y verificar si el seller es nuestra cuenta
    for (let i = 1; i <= count; i++) {
      try {
        // Usar fetch para leer el item del contrato
        const response = await fetch("/api/marketplace/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: i }),
        });

        if (response.ok) {
          const item = await response.json();

          // Verificar si el seller es nuestra cuenta
          if (
            item.seller &&
            item.seller.toLowerCase() === address.toLowerCase()
          ) {
            myProducts.push({
              itemId: BigInt(item.itemId),
              tokenId: BigInt(item.tokenId),
              price: BigInt(item.price),
              totalPrice: BigInt(item.totalPrice),
              sold: item.sold,
            });
          }
        }
      } catch (error) {
        console.error(`Error loading item ${i}:`, error);
      }
    }

    console.log("🎨 Mis productos:", myProducts);
    setProducts(myProducts);
  };

  // Separar productos en vendidos y en venta
  const productsEnVenta = products.filter((p) => !p.sold);
  const productsVendidos = products.filter((p) => p.sold);

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
          <h1 className="text-3xl font-bold">Mis Productos</h1>
          <p className="text-gray-400 mt-1">
            NFTs que has listado en el marketplace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="bordered">← Volver al Marketplace</Button>
          </Link>
          <Link href="/marketplace/create">
            <Button color="primary">+ Crear NFT</Button>
          </Link>
          <ConnectButton />
        </div>
      </div>

      {/* Stats Cards */}
      {isConnected && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Listados</p>
                  <p className="text-3xl font-bold text-purple-400 mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="text-5xl opacity-50">📦</div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">En Venta</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">
                    {productsEnVenta.length}
                  </p>
                </div>
                <div className="text-5xl opacity-50">🔵</div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Vendidos</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {productsVendidos.length}
                  </p>
                </div>
                <div className="text-5xl opacity-50">✅</div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Content */}
      {!isConnected ? (
        <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
          <span className="text-6xl mb-4 block">🔒</span>
          <p className="text-xl text-gray-400">
            Conecta tu wallet para ver tus productos
          </p>
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      ) : isLoadingCount ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
          <span className="text-6xl mb-4 block">🎨</span>
          <p className="text-xl text-gray-400 mb-2">
            Aún no has listado ningún NFT
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Crea tu primer NFT y empieza a vender
          </p>
          <Link href="/marketplace/create">
            <Button color="primary" size="lg">
              Crear Mi Primer NFT
            </Button>
          </Link>
        </div>
      ) : (
        <Tabs aria-label="Products tabs" color="primary" size="lg">
          <Tab
            key="all"
            title={
              <div className="flex items-center gap-2">
                <span>📦</span>
                <span>Todos ({products.length})</span>
              </div>
            }
          >
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductNFTCard
                    key={product.itemId.toString()}
                    itemId={product.itemId}
                    tokenId={product.tokenId}
                    price={product.price}
                    totalPrice={product.totalPrice}
                    sold={product.sold}
                    nftAddress={nftAddress}
                    pinataGateway={pinataGateway}
                    feePercent={Number(feePercent || 0)}
                  />
                ))}
              </div>
            </div>
          </Tab>

          <Tab
            key="on-sale"
            title={
              <div className="flex items-center gap-2">
                <span>🔵</span>
                <span>En Venta ({productsEnVenta.length})</span>
              </div>
            }
          >
            <div className="mt-6">
              {productsEnVenta.length === 0 ? (
                <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
                  <span className="text-6xl mb-4 block">🔵</span>
                  <p className="text-xl text-gray-400">
                    Todos tus NFTs han sido vendidos
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsEnVenta.map((product) => (
                    <ProductNFTCard
                      key={product.itemId.toString()}
                      itemId={product.itemId}
                      tokenId={product.tokenId}
                      price={product.price}
                      totalPrice={product.totalPrice}
                      sold={product.sold}
                      nftAddress={nftAddress}
                      pinataGateway={pinataGateway}
                      feePercent={Number(feePercent || 0)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab>

          <Tab
            key="sold"
            title={
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Vendidos ({productsVendidos.length})</span>
              </div>
            }
          >
            <div className="mt-6">
              {productsVendidos.length === 0 ? (
                <div className="text-center py-12 bg-[#202222] rounded-lg border border-[#383838]">
                  <span className="text-6xl mb-4 block">💤</span>
                  <p className="text-xl text-gray-400">
                    Aún no has vendido ningún NFT
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsVendidos.map((product) => (
                    <ProductNFTCard
                      key={product.itemId.toString()}
                      itemId={product.itemId}
                      tokenId={product.tokenId}
                      price={product.price}
                      totalPrice={product.totalPrice}
                      sold={product.sold}
                      nftAddress={nftAddress}
                      pinataGateway={pinataGateway}
                      feePercent={Number(feePercent || 0)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
}
