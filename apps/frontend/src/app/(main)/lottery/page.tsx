"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Link, Button, Input } from "@heroui/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import { useForm } from "react-hook-form";
import LotteryABI from "@/abis/Lottery.json";

const LOTTERY_ADDRESS = process.env
  .NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;

type CompraBoletoForm = {
  numBoletos: string;
};

export default function LotteryPage() {
  const { address, isConnected } = useAccount();
  const [isCompraSuccess, setIsCompraSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Evitar hydration mismatch
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form para compra de boletos
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CompraBoletoForm>();

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
  const numBoletosValue = watch("numBoletos");

  // Balance de tokens del usuario
  const { data: balanceTokensUser, isLoading: loadingBalance } =
    useReadContract({
      address: LOTTERY_ADDRESS,
      abi: LotteryABI.abi,
      functionName: "balanceTokens",
      args: [address],
      query: {
        enabled: !!address && !!LOTTERY_ADDRESS,
        refetchInterval: 10_000,
      },
    });

  // Boletos del usuario
  const {
    data: tusBoletos,
    isLoading: loadingBoletos,
    refetch: refetchBoletos,
  } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI.abi,
    functionName: "tusBoletos",
    args: [address],
    query: {
      enabled: !!address && !!LOTTERY_ADDRESS,
      refetchInterval: 10_000,
    },
  });

  // Refetch boletos cuando la transacción se confirme
  React.useEffect(() => {
    if (isConfirmed) {
      refetchBoletos();
    }
  }, [isConfirmed, refetchBoletos]);

  // Precio del boleto (5 tokens ERC-20)
  const PRECIO_BOLETO = 5;

  // Función para comprar boletos
  const onCompraBoleto = async (data: CompraBoletoForm) => {
    try {
      setErrorMessage("");
      const numBoletos = BigInt(Math.floor(parseFloat(data.numBoletos)));

      console.log("🎫 Datos de compra de boletos:", {
        numBoletosInput: data.numBoletos,
        numBoletosInteger: numBoletos.toString(),
        balanceTokensUser: balanceTokensUser?.toString(),
        address: LOTTERY_ADDRESS,
      });

      // Validar que el valor sea positivo
      if (numBoletos <= BigInt(0)) {
        setErrorMessage("La cantidad debe ser mayor a 0");
        return;
      }

      // Calcular el costo total en wei (5 tokens por boleto)
      const costoTotalWei =
        numBoletos * BigInt(PRECIO_BOLETO) * BigInt(10 ** 18);

      // Validar que el usuario tenga suficientes tokens
      if (balanceTokensUser && costoTotalWei > (balanceTokensUser as bigint)) {
        const balanceActual = parseFloat(
          formatUnits(balanceTokensUser as bigint, 18)
        ).toFixed(2);
        const tokensNecesarios = (Number(numBoletos) * PRECIO_BOLETO).toFixed(
          2
        );
        setErrorMessage(
          `No tienes suficientes tokens. Necesitas ${tokensNecesarios} RELO pero tienes ${balanceActual} RELO`
        );
        return;
      }

      console.log("✅ Validaciones pasadas, enviando transacción...");

      writeContract({
        address: LOTTERY_ADDRESS,
        abi: LotteryABI.abi,
        functionName: "compraBoleto",
        args: [numBoletos],
      });
    } catch (error: any) {
      console.error("❌ Error al comprar boletos:", error);
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
        <h1 className="text-4xl font-bold text-white mb-2">
          Sistema de lotería descentralizada
        </h1>
        <p className="text-gray-400">Compra de Boletos</p>
      </div>
      <div className="flex gap-4 mb-6">
        <Link color="secondary" href="/lottery/tokens">
          Balance de Tokens
        </Link>
        <Link color="success" href="/lottery/ganador">
          Emisión de Premio
        </Link>
      </div>

      {/* Card de Compra de Boletos */}
      <Card className="bg-gray-900/50 border border-gray-800 mb-6">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎫</div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Gestión de compra de boletos de lotería NFTs ERC-721 con tokens
                ERC-20
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Cada boleto cuesta {PRECIO_BOLETO} tokens RELO
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          {!isMounted ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Cargando...</p>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Conecta tu wallet para comprar boletos
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
                        Tus boletos NFT han sido creados correctamente
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

              {/* Información del balance de tokens */}
              {!loadingBalance && (
                <div className="mb-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      <span className="text-purple-300 font-semibold">
                        Tu balance:
                      </span>
                    </div>
                    <span className="text-white font-bold text-xl">
                      {balanceTokensUser
                        ? parseFloat(
                            formatUnits(balanceTokensUser as bigint, 18)
                          ).toFixed(2)
                        : "0"}{" "}
                      RELO
                    </span>
                  </div>
                </div>
              )}

              {/* Alerta de información */}
              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-yellow-300 font-semibold text-sm mb-1">
                      Requisitos para comprar boletos:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Cada boleto cuesta {PRECIO_BOLETO} tokens RELO</li>
                      <li>
                        • Debes tener suficientes tokens RELO en tu wallet
                      </li>
                      <li>• Los boletos se generan como NFTs ERC-721</li>
                      <li>
                        • Si no tienes tokens, ve a la sección "Balance de
                        Tokens"
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Formulario de compra */}
              <form
                onSubmit={handleSubmit(onCompraBoleto)}
                className="space-y-6"
              >
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cantidad de Boletos
                    </label>
                    <Input
                      {...register("numBoletos", {
                        required: "La cantidad es requerida",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Debe ser un número entero válido",
                        },
                        validate: {
                          positive: (value) =>
                            parseInt(value) > 0 ||
                            "La cantidad debe ser mayor a 0",
                        },
                      })}
                      type="text"
                      placeholder="Ej: 3"
                      classNames={{
                        input: "bg-gray-900 text-white",
                        inputWrapper:
                          "bg-gray-900 border-gray-700 hover:border-blue-500 focus-within:border-blue-500",
                      }}
                      size="lg"
                      disabled={isPending || isConfirming}
                    />
                    {errors.numBoletos && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.numBoletos.message}
                      </p>
                    )}
                  </div>

                  {/* Información del costo estimado */}
                  {numBoletosValue && !isNaN(parseInt(numBoletosValue)) && (
                    <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          Boletos a comprar:
                        </span>
                        <span className="text-white font-semibold">
                          {numBoletosValue} boleto(s)
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          Costo por boleto:
                        </span>
                        <span className="text-white font-semibold">
                          {PRECIO_BOLETO} RELO
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                        <span className="text-sm text-gray-400 font-semibold">
                          Costo total:
                        </span>
                        <span className="text-white font-bold text-lg">
                          {parseInt(numBoletosValue) * PRECIO_BOLETO} RELO
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Información de la compra */}
                  <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div className="flex-1 text-xs text-gray-300">
                        <p className="font-semibold text-blue-300 mb-1">
                          ¿Cómo funciona?
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>
                            Se generará un número aleatorio único por cada
                            boleto
                          </li>
                          <li>
                            Cada boleto se acuñará como un NFT ERC-721 en tu
                            wallet
                          </li>
                          <li>
                            Los tokens RELO se transferirán al Smart Contract
                          </li>
                          <li>Podrás ver tus boletos en la tabla de abajo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de compra */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg py-6 shadow-lg shadow-blue-500/30 transition-all"
                  size="lg"
                  isLoading={isPending || isConfirming}
                  isDisabled={isPending || isConfirming}
                >
                  {isPending
                    ? "Esperando aprobación..."
                    : isConfirming
                    ? "Confirmando..."
                    : "Comprar Boletos"}
                </Button>
              </form>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Card de Boletos Comprados */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎰</div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Tus Boletos de Lotería
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Boletos NFT que has comprado
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Conecta tu wallet para ver tus boletos
              </p>
            </div>
          ) : loadingBoletos ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-3">Cargando boletos...</p>
            </div>
          ) : !tusBoletos || (tusBoletos as any[]).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No tienes boletos
              </h3>
              <p className="text-gray-400 mb-6">
                Aún no has comprado ningún boleto de lotería
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-300">
                  💡 Compra boletos usando el formulario de arriba para
                  participar en la lotería
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-300">
                  Total de boletos:{" "}
                  <span className="text-white font-bold text-xl">
                    {(tusBoletos as any[]).length}
                  </span>
                </p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                  <span className="text-green-300 text-sm font-semibold">
                    ✨ ¡Buena suerte!
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 bg-blue-500/10">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300 bg-cyan-500/10">
                        Número de Boleto (NFT ID)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 bg-purple-500/10">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tusBoletos as any[]).map((boleto, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-left">
                          <span className="text-white font-medium">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🎫</span>
                            <span className="text-white font-mono font-bold text-lg">
                              {boleto.toString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs font-semibold text-green-300">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            Activo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Información adicional */}
              <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-blue-300 font-semibold text-sm mb-1">
                      Sobre tus boletos:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>
                        • Cada boleto es un NFT único ERC-721 en tu wallet
                      </li>
                      <li>• El número del boleto es generado aleatoriamente</li>
                      <li>
                        • Todos los boletos participan en el sorteo de la
                        lotería
                      </li>
                      <li>
                        • El ganador se selecciona cuando el administrador
                        ejecuta el sorteo
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
