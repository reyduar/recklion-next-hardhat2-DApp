"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Progress, Tooltip } from "@heroui/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import MasterABI from "@/abis/MasterChefToken.json";
import ReyABI from "@/abis/ReyRewardToken.json";

export const IssueRewards = () => {
  const { address, isConnected } = useAccount();
  const chefAddress = process.env.NEXT_PUBLIC_CHEF_ADDRESS as `0x${string}`;
  const reyAddress = process.env.NEXT_PUBLIC_REY_ADDRESS as `0x${string}`;

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  // 🧠 Leer el owner del contrato
  const { data: ownerData } = useReadContract({
    address: chefAddress,
    abi: MasterABI.abi,
    functionName: "owner",
  });

  const owner = ownerData ? String(ownerData) : null;

  // 💰 Leer balance actual del contrato de REY
  const { data: reyBalanceData, refetch: refetchReyBalance } = useReadContract({
    address: reyAddress,
    abi: ReyABI.abi,
    functionName: "balanceOf",
    args: [chefAddress],
  });

  const formattedRey = reyBalanceData
    ? Number(formatUnits(reyBalanceData as bigint, 18))
    : 0;

  // ✍️ Escribir en el contrato
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();

  // ⏳ Esperar confirmación de transacción
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // 🚀 Mostrar mensaje cuando se confirma la emisión
  useEffect(() => {
    if (isSuccess) {
      refetchReyBalance();
      setStatusMessage({
        text: "✅ Recompensas emitidas - Los tokens REY fueron distribuidos exitosamente.",
        type: "success",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  }, [isSuccess]);

  // 🪙 Emitir tokens (solo el owner puede hacerlo)
  const handleIssue = async () => {
    if (!isConnected) {
      setStatusMessage({
        text: "⚠️ Wallet no conectada - Conectá tu wallet para continuar.",
        type: "warning",
      });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    if (address?.toLowerCase() !== owner?.toLowerCase()) {
      setStatusMessage({
        text: "⛔ Permiso denegado - Solo el owner del contrato puede emitir recompensas.",
        type: "error",
      });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    if (formattedRey <= 0) {
      setStatusMessage({
        text: "💸 Sin fondos disponibles - El contrato no tiene tokens REY suficientes.",
        type: "warning",
      });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    try {
      setIsProcessing(true);

      const tx = await writeContractAsync({
        address: chefAddress,
        abi: MasterABI.abi,
        functionName: "issueTokens",
        args: [],
      });

      setStatusMessage({
        text: `🚀 Transacción enviada - Hash: ${tx.slice(0, 10)}...${tx.slice(
          -8
        )}`,
        type: "info",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Error al emitir tokens:", err);
      setStatusMessage({
        text: "❌ Error - No se pudieron emitir los tokens. Revisá la consola.",
        type: "error",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <Card shadow="sm" className="w-full">
        <CardBody className="flex flex-col gap-4 items-center text-center">
          <h3 className="font-semibold text-lg">
            🎯 Emitir Tokens de Recompensa
          </h3>
          <p className="text-gray-600 text-sm">
            Esta acción distribuye tokens <strong>REY</strong> entre todos los
            stakers actuales. Solo el owner del contrato puede ejecutarla.
          </p>

          <Tooltip
            content={
              formattedRey <= 0
                ? "El contrato no tiene tokens REY disponibles."
                : "Emitir recompensas a los stakers."
            }
            placement="top"
          >
            <Button
              color="secondary"
              size="lg"
              onPress={handleIssue}
              isDisabled={
                isPending ||
                confirming ||
                isProcessing ||
                formattedRey <= 0 ||
                !isConnected
              }
            >
              {isProcessing || confirming
                ? "Emitiendo..."
                : "Emitir Recompensas"}
            </Button>
          </Tooltip>

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                statusMessage.type === "success"
                  ? "bg-green-500/20 text-green-300"
                  : statusMessage.type === "error"
                  ? "bg-red-500/20 text-red-300"
                  : statusMessage.type === "warning"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-blue-500/20 text-blue-300"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {(isPending || confirming) && (
            <Progress
              color="secondary"
              isIndeterminate
              label="Procesando transacción..."
              className="w-full mt-2"
            />
          )}

          {owner && (
            <p className="text-xs text-gray-500 mt-2">
              🧑‍💼 Owner actual:{" "}
              <span className="font-mono text-gray-700">{owner}</span>
            </p>
          )}

          <p className="text-xs text-gray-500">
            💰 Balance disponible en contrato:{" "}
            <span className="font-mono text-gray-700">
              {formattedRey.toFixed(4)} REY$
            </span>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
