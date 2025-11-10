"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Input, Progress } from "@heroui/react";
import { useForm } from "react-hook-form";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import DamcABI from "@/abis/DamcStakedToken.json";
import Image from "next/image";

export const FundMasterChef = () => {
  const { address, isConnected } = useAccount();
  const [isFunding, setIsFunding] = useState(false);

  const damcAddress = process.env.NEXT_PUBLIC_DAMC_ADDRESS as `0x${string}`;
  const chefAddress = process.env.NEXT_PUBLIC_CHEF_ADDRESS as `0x${string}`;

  const { register, handleSubmit, reset } = useForm<{ amount: string }>({
    defaultValues: { amount: "1000" },
  });

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // ✅ Mostrar notificación cuando la transacción se confirme
  useEffect(() => {
    if (isSuccess) {
      alert("✅ Tokens DAMC fondeados con éxito en MasterChef!");
    }
  }, [isSuccess]);

  // 🧩 Enviar tokens DAMC al contrato MasterChef
  const handleFund = async (data: { amount: string }) => {
    if (!isConnected) return alert("Conectá tu wallet.");
    setIsFunding(true);
    try {
      const amountWei = parseUnits(data.amount, 18);

      const tx = await writeContractAsync({
        address: damcAddress,
        abi: DamcABI.abi,
        functionName: "transfer",
        args: [chefAddress, amountWei],
      });

      alert(`✅ Transacción enviada: ${tx}`);
      reset();
    } catch (err) {
      console.error("Error al fondear el contrato:", err);
      alert("❌ Error al transferir tokens, revisá la consola.");
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <Card shadow="sm" className="w-full">
        <CardBody className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg text-center">
            💰 Fondear contrato MasterChef
          </h3>
          <p className="text-gray-600 text-sm text-center">
            Enviá tokens DAMC al contrato para permitir pruebas de unstake y
            staking.
          </p>

          <form
            onSubmit={handleSubmit(handleFund)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                {...register("amount", { required: true })}
                className="flex-1 text-lg"
              />
              <div className="flex items-center gap-2 border rounded-lg px-2 bg-gray-50">
                <Image src="/logo.png" alt="DAMC" width={28} height={28} />
                <span className="font-semibold text-gray-600">DMC$</span>
              </div>
            </div>

            <Button
              type="submit"
              color="success"
              fullWidth
              size="lg"
              isDisabled={isPending || confirming || isFunding}
            >
              {isFunding || confirming
                ? "Transfiriendo..."
                : "Enviar al contrato"}
            </Button>
          </form>

          {(isPending || confirming) && (
            <Progress
              color="success"
              isIndeterminate
              label="Procesando transacción..."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
