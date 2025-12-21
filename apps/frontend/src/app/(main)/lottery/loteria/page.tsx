"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import LotteryABI from "@/abis/Lottery.json";

const LOTTERY_ADDRESS = process.env
  .NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;

export default function LoteriaPage() {
  const { address, isConnected } = useAccount();

  // Balance de tokens del Smart Contract
  const { data: balanceTokensSC, isLoading: loadingSC } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI.abi,
    functionName: "balanceTokensSC",
    query: {
      enabled: !!LOTTERY_ADDRESS,
      refetchInterval: 10_000,
    },
  });

  // Balance de tokens del usuario
  const { data: balanceTokensUser, isLoading: loadingUser } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI.abi,
    functionName: "balanceTokens",
    args: [address],
    query: {
      enabled: !!address && !!LOTTERY_ADDRESS,
      refetchInterval: 10_000,
    },
  });

  // Balance de Ethers del Smart Contract
  const { data: balanceEthersSC, isLoading: loadingEthers } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI.abi,
    functionName: "balanceEthersSC",
    query: {
      enabled: !!LOTTERY_ADDRESS,
      refetchInterval: 10_000,
    },
  });

  const isLoading = loadingSC || loadingUser || loadingEthers;

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Lotería</h1>
        <p className="text-gray-400">Sistema de Lotería Descentralizada</p>
      </div>

      {/* Card de Balances */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Balance de los Tokens ERC-20
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Información de tokens RELO y fondos de la lotería
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Conecta tu wallet para ver los balances
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-3">Cargando balances...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 bg-purple-500/10">
                      Tokens Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 bg-blue-500/10">
                      Tokens SC
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-orange-300 bg-orange-500/10">
                      Ethers Lotería
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-6 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-white">
                          {balanceTokensUser
                            ? formatUnits(balanceTokensUser as bigint, 18)
                            : "0"}
                        </span>
                        <span className="text-xs text-gray-400">
                          RELO tokens
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-white">
                          {balanceTokensSC
                            ? formatUnits(balanceTokensSC as bigint, 18)
                            : "0"}
                        </span>
                        <span className="text-xs text-gray-400">
                          RELO disponibles
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-white">
                          {balanceEthersSC
                            ? formatUnits(balanceEthersSC as bigint, 0)
                            : "0"}
                        </span>
                        <span className="text-xs text-gray-400">
                          ETH en pool
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Información adicional */}
          {isConnected && !isLoading && (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-xs text-purple-300 mb-1">💡 Tu Balance</p>
                <p className="text-xs text-gray-400">
                  Tokens RELO que posees para comprar boletos
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-xs text-blue-300 mb-1">🏦 Tokens SC</p>
                <p className="text-xs text-gray-400">
                  Tokens disponibles en el contrato para la venta
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-xs text-orange-300 mb-1">
                  🎰 Pool de Premios
                </p>
                <p className="text-xs text-gray-400">
                  ETH acumulado que se distribuirá al ganador
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
