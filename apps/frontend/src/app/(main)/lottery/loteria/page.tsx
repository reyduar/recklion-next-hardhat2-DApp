"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseEther } from "viem";
import { useForm } from "react-hook-form";
import LotteryABI from "@/abis/Lottery.json";

const LOTTERY_ADDRESS = process.env
  .NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;

type CompraTokensForm = {
  numTokens: string;
};

export default function LoteriaPage() {
  const { address, isConnected } = useAccount();
  const [isCompraSuccess, setIsCompraSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form para compra de tokens
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CompraTokensForm>();

  // Hook para escribir en el contrato
  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract();

  // Hook para esperar la confirmación de la transacción
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Efecto para manejar el éxito de la transacción
  React.useEffect(() => {
    if (isConfirmed) {
      setIsCompraSuccess(true);
      setErrorMessage("");
      reset();
      setTimeout(() => setIsCompraSuccess(false), 5000);
    }
  }, [isConfirmed, reset]);

  // Efecto para manejar errores
  React.useEffect(() => {
    if (writeError) {
      const errorMsg = (writeError as any)?.shortMessage || writeError.message;
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 10000);
    }
  }, [writeError]);

  // Observar el valor del input
  const numTokensValue = watch("numTokens");

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

  // Función para comprar tokens
  const onCompraTokens = async (data: CompraTokensForm) => {
    try {
      setErrorMessage("");
      // IMPORTANTE: El contrato espera el número de tokens SIN decimales
      // porque internamente ya multiplica por 1 ether
      const numTokens = BigInt(data.numTokens);
      const value = parseEther(data.numTokens); // El valor sí debe estar en wei

      console.log("🔍 Datos de compra:", {
        numTokens: data.numTokens,
        numTokensValue: numTokens.toString(),
        valueWei: value.toString(),
        balanceTokensSC: balanceTokensSC?.toString(),
        address: LOTTERY_ADDRESS,
      });

      // Validar que el valor sea positivo
      if (numTokens <= BigInt(0)) {
        setErrorMessage("La cantidad debe ser mayor a 0");
        return;
      }

      // El balance del SC está en wei, necesitamos comparar números enteros
      const balanceSCTokens = balanceTokensSC
        ? (balanceTokensSC as bigint) / BigInt(10 ** 18)
        : BigInt(0);

      // Validar que haya suficientes tokens en el SC
      if (balanceSCTokens < numTokens) {
        setErrorMessage(
          `No hay suficientes tokens. Disponibles: ${balanceSCTokens.toString()}`
        );
        return;
      }

      console.log("✅ Validaciones pasadas, enviando transacción...");

      writeContract({
        address: LOTTERY_ADDRESS,
        abi: LotteryABI.abi,
        functionName: "compraTokens",
        args: [numTokens],
        value: value,
      });
    } catch (error: any) {
      console.error("❌ Error al comprar tokens:", error);
      const errorMsg =
        error?.shortMessage ||
        error?.message ||
        "Error desconocido al procesar la compra";
      setErrorMessage(errorMsg);
    }
  };

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

      {/* Card de Compra de Tokens */}
      <Card className="bg-gray-900/50 border border-gray-800 mt-6">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛒</div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Compra de Tokens ERC-20
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Compra tokens RELO para participar en la lotería
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Conecta tu wallet para comprar tokens
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Mensajes de estado */}
              {isCompraSuccess && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="text-green-300 font-semibold">
                        ¡Compra exitosa!
                      </p>
                      <p className="text-sm text-gray-400">
                        Los tokens han sido transferidos a tu wallet
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="text-red-300 font-semibold">
                        Error en la transacción
                      </p>
                      <p className="text-sm text-gray-400">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {isConfirming && (
                <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <div>
                      <p className="text-blue-300 font-semibold">
                        Confirmando transacción...
                      </p>
                      <p className="text-sm text-gray-400">
                        Espera a que se confirme en la blockchain
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Alerta de requisitos */}
              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-yellow-300 font-semibold text-sm mb-1">
                      Requisitos para comprar:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>
                        • Debes tener suficiente ETH/MATIC en tu wallet (1 RELO
                        = 1 ETH/MATIC)
                      </li>
                      <li>
                        • El Smart Contract debe tener tokens RELO disponibles
                      </li>
                      <li>• Asegúrate de estar conectado a la red correcta</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Formulario de compra */}
              <form
                onSubmit={handleSubmit(onCompraTokens)}
                className="space-y-6"
              >
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cantidad de Tokens RELO
                    </label>
                    <Input
                      {...register("numTokens", {
                        required: "La cantidad es requerida",
                        pattern: {
                          value: /^[0-9]+$/,
                          message:
                            "Debe ser un número entero válido (sin decimales)",
                        },
                        validate: {
                          positive: (value) =>
                            parseInt(value) > 0 ||
                            "La cantidad debe ser mayor a 0",
                        },
                      })}
                      type="number"
                      placeholder="Ej: 10"
                      classNames={{
                        input: "bg-gray-900 text-white",
                        inputWrapper:
                          "bg-gray-900 border-gray-700 hover:border-purple-500 focus-within:border-purple-500",
                      }}
                      size="lg"
                      disabled={isPending || isConfirming}
                    />
                    {errors.numTokens && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.numTokens.message}
                      </p>
                    )}
                  </div>

                  {/* Información del costo estimado */}
                  {numTokensValue && !isNaN(parseFloat(numTokensValue)) && (
                    <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          Tokens a comprar:
                        </span>
                        <span className="text-white font-semibold">
                          {numTokensValue} RELO
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          Costo total:
                        </span>
                        <span className="text-white font-semibold">
                          {numTokensValue} ETH
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Disponibles en SC:
                        </span>
                        <span className="text-white font-semibold">
                          {balanceTokensSC
                            ? formatUnits(balanceTokensSC as bigint, 18)
                            : "0"}{" "}
                          RELO
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Información de la compra */}
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div className="flex-1 text-xs text-gray-300">
                        <p className="font-semibold text-purple-300 mb-1">
                          Información de compra:
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>1 Token RELO = 1 ETH/MATIC (según tu red)</li>
                          <li>
                            ⚠️ Solo puedes comprar tokens en números enteros (1,
                            2, 3...)
                          </li>
                          <li>
                            Los tokens se transferirán instantáneamente a tu
                            wallet
                          </li>
                          <li>
                            Necesitas tokens RELO para comprar boletos de
                            lotería
                          </li>
                          <li>El exceso de ETH enviado será devuelto</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de compra */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-6 shadow-lg shadow-purple-500/30 transition-all"
                  size="lg"
                  isLoading={isPending || isConfirming}
                  isDisabled={isPending || isConfirming}
                >
                  {isPending
                    ? "Esperando aprobación..."
                    : isConfirming
                    ? "Confirmando..."
                    : "Comprar Tokens"}
                </Button>
              </form>

              {/* Información adicional */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-300 mb-1 font-semibold">
                    🔒 Seguridad
                  </p>
                  <p className="text-xs text-gray-400">
                    Tu transacción es segura y descentralizada en la blockchain
                  </p>
                </div>
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-300 mb-1 font-semibold">
                    ⚡ Rápido
                  </p>
                  <p className="text-xs text-gray-400">
                    Recibe tus tokens en segundos después de la confirmación
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
