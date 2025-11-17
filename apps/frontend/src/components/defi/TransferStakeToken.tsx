"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  Card,
  CardBody,
  Button,
  Input,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
} from "@heroui/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, formatUnits } from "viem";
import DamcABI from "@/abis/DamcStakedToken.json";
import ReyABI from "@/abis/ReyRewardToken.json";
import MasterABI from "@/abis/MasterChefToken.json";
import { config } from "@/config/wagmi";

export const TransferStakeToken = () => {
  const { address, isConnected } = useAccount();
  const damcAddress = process.env.NEXT_PUBLIC_DAMC_ADDRESS as `0x${string}`;
  const reyAddress = process.env.NEXT_PUBLIC_REY_ADDRESS as `0x${string}`;
  const chefAddress = process.env.NEXT_PUBLIC_CHEF_ADDRESS as `0x${string}`;

  // Estados visuales locales
  const [localStake, setLocalStake] = useState<number>(0);
  const [localRey, setLocalRey] = useState<number>(0);

  // Leer balances reales al inicio
  const { data: damcBalance, refetch: refetchDamc } = useReadContract({
    address: damcAddress,
    abi: DamcABI.abi,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: reyBalance, refetch: refetchRey } = useReadContract({
    address: reyAddress,
    abi: ReyABI.abi,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: stakingBalance, refetch: refetchStake } = useReadContract({
    address: chefAddress,
    abi: MasterABI.abi,
    functionName: "stakingBalance",
    args: [address],
  });

  // Parsear valores iniciales
  const formattedDamc = damcBalance
    ? Number(formatUnits(damcBalance as bigint, 18))
    : 0;
  const formattedRey = reyBalance
    ? Number(formatUnits(reyBalance as bigint, 18))
    : 0;
  const formattedStake = stakingBalance
    ? Number(formatUnits(stakingBalance as bigint, 18))
    : 0;

  // Inicializar estados visuales con balances
  useEffect(() => {
    if (formattedStake >= 0) setLocalStake(formattedStake);
    if (formattedRey >= 0) setLocalRey(formattedRey);
  }, [formattedStake, formattedRey]);

  // Contratos
  const { writeContractAsync, isPending } = useWriteContract();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ amount: string }>({
    defaultValues: { amount: "" },
  });

  // 🧩 Stake tokens
  const handleStake = async (data: { amount: string }) => {
    if (!isConnected) return alert("Conectá tu wallet.");
    const amountWei = parseUnits(data.amount, 18);

    try {
      setIsProcessing(true);

      // 1️⃣ Approve primero
      const txApprove = await writeContractAsync({
        address: damcAddress,
        abi: DamcABI.abi,
        functionName: "approve",
        args: [chefAddress, amountWei],
      });
      await waitForTransactionReceipt(config, { hash: txApprove });

      // 2️⃣ Luego stake
      const txStake = await writeContractAsync({
        address: chefAddress,
        abi: MasterABI.abi,
        functionName: "stakeTokens",
        args: [amountWei],
      });
      await waitForTransactionReceipt(config, { hash: txStake });

      // 3️⃣ Refrescar balances
      const [newDamc, newRey, newStake] = await Promise.all([
        refetchDamc(),
        refetchRey(),
        refetchStake(),
      ]);

      setLocalStake(Number(formatUnits(newStake.data as bigint, 18)));
      setLocalRey(Number(formatUnits(newRey.data as bigint, 18)));
      reset();
    } catch (err) {
      console.error("Error en stake:", err);
      alert("Error al hacer stake, revisá la consola.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🧩 Unstake tokens
  const handleUnstake = async () => {
    if (!isConnected) return alert("Conectá tu wallet.");

    try {
      setIsProcessing(true);

      // leer stakingBalance antes
      const stakeValue = await readContract(config, {
        address: chefAddress,
        abi: MasterABI.abi,
        functionName: "stakingBalance",
        args: [address],
      });

      if (!stakeValue || stakeValue === 0) {
        alert("No tenés tokens en staking para retirar.");
        setIsProcessing(false);
        return;
      }

      const tx = await writeContractAsync({
        address: chefAddress,
        abi: MasterABI.abi,
        functionName: "unstakeTokens",
      });

      await waitForTransactionReceipt(config, { hash: tx });

      await Promise.all([refetchDamc(), refetchRey(), refetchStake()]);
    } catch (err) {
      console.error("Error en unstake:", err);
      alert("Error al retirar stake, revisá la consola.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4">
      {/* Tabla de balances */}
      <Table
        aria-label="Balances actuales"
        removeWrapper
        className="text-center text-gray-600 mb-4"
      >
        <TableHeader>
          <TableColumn>Balance de Staking</TableColumn>
          <TableColumn>Balance de recompensas</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{localStake.toFixed(2)} DMC$</TableCell>
            <TableCell>{localRey.toFixed(2)} REY$</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Card principal */}
      <Card shadow="sm" className="w-full">
        <CardBody className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Stake Tokens</h3>
            <span className="text-gray-500 text-sm">
              Balance: {formattedDamc.toFixed(2)}
            </span>
          </div>

          <form
            onSubmit={handleSubmit(handleStake)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                placeholder="0"
                {...register("amount", { required: true })}
                className="flex-1 text-lg"
              />
              <div className="flex items-center gap-2 border rounded-lg px-2 bg-gray-50">
                <Image src="/logo.png" alt="Token" width={28} height={28} />
                <span className="font-semibold text-gray-600">DMC$</span>
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              fullWidth
              size="lg"
              isDisabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : "Stake"}
            </Button>
          </form>

          <Divider />

          <Button
            color="primary"
            variant="ghost"
            fullWidth
            size="lg"
            onPress={handleUnstake}
            isDisabled={isProcessing}
          >
            Retirar Stake
          </Button>

          {isProcessing && (
            <Progress
              color="primary"
              isIndeterminate
              label="Procesando transacción..."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
