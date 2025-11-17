"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { Card, CardBody } from "@heroui/react";

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
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-gray-400">Polygon Amoy Wallet</p>
        </div>

        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-8">
            <div className="flex flex-col items-center justify-center py-12">
              {/* Wallet connect */}
              <ConnectButton />

              {isConnected && (
                <div className="mt-6 p-6 bg-gray-100 rounded-2xl shadow-md w-[360px] text-left mx-auto">
                  <p className="font-semibold text-gray-700 mb-2">Cuenta:</p>
                  <p className="break-all text-gray-800">
                    {address ?? "No conectado"}
                  </p>

                  <p className="font-semibold text-gray-700 mt-4 mb-1">
                    Balance:
                  </p>
                  {balanceLoading ? (
                    <p className="text-gray-500">Cargando...</p>
                  ) : (
                    <p className="text-gray-900 text-lg font-bold">
                      {balanceData?.formatted} {balanceData?.symbol ?? "POL"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
