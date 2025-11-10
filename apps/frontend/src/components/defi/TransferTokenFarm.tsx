"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress,
  Spacer,
  Divider,
} from "@heroui/react";
import { RiExchangeDollarFill } from "react-icons/ri";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import ReyABI from "@/abis/ReyRewardToken.json";

export const TransferTokenFarm = () => {
  const [chefBalance, setChefBalance] = useState<string>("0");

  const { address, isConnected } = useAccount();

  const chefAddress = process.env.NEXT_PUBLIC_CHEF_ADDRESS as `0x${string}`;
  const reyAddress = process.env.NEXT_PUBLIC_REY_ADDRESS as `0x${string}`;

  // Leer balance actual del usuario (ReyRewardToken)
  const {
    data: reyBalance,
    refetch: refetchReyBalance,
    isLoading: isLoadingRey,
  } = useReadContract({
    address: reyAddress,
    abi: ReyABI.abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address },
  });

  // Leer balance actual del MasterChef (ReyRewardToken balance del contrato)
  const {
    data: chefBalanceData,
    refetch: refetchChefBalance,
    isLoading: isLoadingChef,
  } = useReadContract({
    address: reyAddress,
    abi: ReyABI.abi,
    functionName: "balanceOf",
    args: [chefAddress],
    query: { enabled: !!chefAddress },
  });

  // Hook para transferir tokens
  const { data: txHash, writeContract, isPending } = useWriteContract();

  // Esperar confirmación
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Actualizar balances cuando la transacción termina
  useEffect(() => {
    if (isSuccess) {
      refetchChefBalance();
      refetchReyBalance();
    }
  }, [isSuccess]);

  // Actualizar visualmente cuando cambian datos
  useEffect(() => {
    if (chefBalanceData)
      setChefBalance(formatUnits(chefBalanceData as bigint, 18));
  }, [chefBalanceData]);

  const transferTokens = async () => {
    if (!isConnected) {
      alert("Conectá tu wallet primero.");
      return;
    }

    const balanceBN = reyBalance as bigint;
    if (!balanceBN || balanceBN === BigInt(0)) {
      alert("No tenés tokens disponibles para transferir.");
      return;
    }

    writeContract({
      address: reyAddress,
      abi: ReyABI.abi,
      functionName: "transfer",
      args: [chefAddress, balanceBN], // transferir el total actual
    });
  };

  const reyFormatted = reyBalance ? formatUnits(reyBalance as bigint, 18) : "0";

  return (
    <Card className="w-full max-w-md p-4 shadow-lg border border-gray-200">
      <CardBody className="flex flex-col gap-3 items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <RiExchangeDollarFill size={24} />
          Transferencia de Recompensas
        </h2>
        <Divider />

        {/* Balance del usuario */}
        <div className="w-full text-left mt-2">
          <p className="text-sm text-gray-500">
            Balance actual de <b>ReyRewardToken</b>:
          </p>
          <p className="text-lg font-semibold text-gray-800">
            {isLoadingRey ? "Cargando..." : `${reyFormatted} REY`}
          </p>
        </div>

        {/* Nuevo bloque: balance del MasterChef */}
        <div className="w-full text-left mt-3">
          <p className="text-sm text-gray-500">
            Balance actual en <b>MasterChefToken</b>:
          </p>
          <p className="text-lg font-semibold text-gray-800">
            {isLoadingChef ? "Cargando..." : `${chefBalance} REY`}
          </p>
        </div>

        <Spacer y={2} />

        <Button
          color="success"
          fullWidth
          startContent={<RiExchangeDollarFill size={20} />}
          isDisabled={
            !isConnected ||
            isPending ||
            isConfirming ||
            Number(reyFormatted) === 0
          }
          onPress={transferTokens}
        >
          {isPending
            ? "Enviando..."
            : isConfirming
            ? "Confirmando..."
            : "Transferir Total Supply"}
        </Button>

        {(isPending || isConfirming) && (
          <div className="w-full mt-4">
            <Progress
              color="success"
              isIndeterminate
              label={
                isPending
                  ? "Transacción enviada. Esperando confirmación..."
                  : "Confirmando en blockchain..."
              }
            />
          </div>
        )}

        {isSuccess && (
          <div className="w-full bg-green-50 border border-green-200 p-3 rounded-xl mt-3 text-center">
            <p className="text-green-700 font-semibold">
              ✅ Transferencia completada
            </p>
            <p className="text-green-600 mt-2">
              Nuevo balance del MasterChefToken: <b>{chefBalance} REY</b>
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
