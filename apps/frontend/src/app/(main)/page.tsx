"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { redirect } from "next/navigation";
import { HiOutlineCubeTransparent } from "react-icons/hi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    chainId: 80002, // Polygon Amoy
    query: {
      enabled: !!address,
      refetchInterval: 10_000, // refresca cada 10 segundos
    },
  });

  return (
    <>
      <div className="flex gap-4 mb-4">
        <Button
          startContent={<HiOutlineCubeTransparent size={24} />}
          onPress={() => redirect("/defi")}
          color="primary"
        >
          DeFi
        </Button>
      </div>
      {/* Wallet connect */}
      <ConnectButton />

      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800">
        🚀 DApp Hardhat + Next 16
      </h1>
      <p className="text-gray-600">Polygon Amoy Wallet</p>

      {/* Mostrar datos si está conectado */}
      {isConnected && (
        <div className="mt-6 p-6 bg-gray-100 rounded-2xl shadow-md w-[360px] text-left">
          <p className="font-semibold text-gray-700 mb-2">Cuenta:</p>
          <p className="break-all text-gray-800">{address ?? "No conectado"}</p>

          <p className="font-semibold text-gray-700 mt-4 mb-1">Balance:</p>
          {balanceLoading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : (
            <p className="text-gray-900 text-lg font-bold">
              {balanceData?.formatted} {balanceData?.symbol ?? "POL"}
            </p>
          )}
        </div>
      )}
    </>
  );
}
