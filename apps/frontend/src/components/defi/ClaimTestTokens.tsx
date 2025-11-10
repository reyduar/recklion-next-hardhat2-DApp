"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Progress } from "@heroui/react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import DamcABI from "@/abis/DamcStakedToken.json";

export const ClaimTestTokens = () => {
  const { address, isConnected } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);

  const damcAddress = process.env.NEXT_PUBLIC_DAMC_ADDRESS as `0x${string}`;
  const claimAmount = "10000"; // cantidad de tokens a reclamar

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // ✅ Alerta cuando se confirme la transacción
  useEffect(() => {
    if (isSuccess) {
      alert(`✅ Reclamaste ${claimAmount} DMC$ de prueba con éxito!`);
    }
  }, [isSuccess]);

  // 🧩 Reclamar tokens DAMC de prueba
  const handleClaim = async () => {
    if (!isConnected) return alert("Conectá tu wallet.");
    setIsClaiming(true);

    try {
      const tx = await writeContractAsync({
        address: damcAddress,
        abi: DamcABI.abi,
        functionName: "mint", // 🔹 o "faucet" si tu contrato usa otro nombre
        args: [address, parseUnits(claimAmount, 18)],
      });

      alert(`🪙 Transacción enviada: ${tx}`);
    } catch (err) {
      console.error("Error al reclamar tokens:", err);
      alert("❌ Error al reclamar tokens, revisá la consola.");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <Card shadow="sm" className="w-full">
        <CardBody className="flex flex-col gap-4 items-center text-center">
          <h3 className="font-semibold text-lg">🎁 Reclamá tokens de prueba</h3>
          <p className="text-gray-600 text-sm">
            Obtené {claimAmount} DMC$ de prueba para testear staking y
            unstaking.
          </p>

          <Button
            color="primary"
            size="lg"
            onPress={handleClaim}
            isDisabled={isPending || confirming || isClaiming}
          >
            {isClaiming || confirming ? "Reclamando..." : "Claim DMC$ Tokens"}
          </Button>

          {(isPending || confirming) && (
            <Progress
              color="primary"
              isIndeterminate
              label="Procesando transacción..."
              className="w-full mt-2"
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
