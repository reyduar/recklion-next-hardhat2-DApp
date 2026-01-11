"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import LotteryABI from "@/abis/Lottery.json";

const LOTTERY_ADDRESS = process.env
  .NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;

export default function GanadorPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isGeneracionSuccess, setIsGeneracionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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
      setIsGeneracionSuccess(true);
      setErrorMessage("");
      setTimeout(() => setIsGeneracionSuccess(false), 5000);
    }
  }, [isConfirmed]);

  // Efecto para manejar errores
  React.useEffect(() => {
    if (writeError) {
      const errorMsg = (writeError as any)?.shortMessage || writeError.message;
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 10000);
    }
  }, [writeError]);

  // Leer la dirección del ganador actual
  const {
    data: ganadorAddress,
    isLoading: loadingGanador,
    refetch: refetchGanador,
  } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LotteryABI.abi,
    functionName: "ganador",
    query: {
      enabled: !!LOTTERY_ADDRESS,
      refetchInterval: 10_000,
    },
  });

  // Leer total de boletos comprados
  const { data: boletosComprados, isLoading: loadingBoletos } = useReadContract(
    {
      address: LOTTERY_ADDRESS,
      abi: LotteryABI.abi,
      functionName: "boletosComprados",
      args: [0], // Intentamos leer el primer elemento para verificar si hay boletos
      query: {
        enabled: !!LOTTERY_ADDRESS,
      },
    }
  );

  // Refetch ganador cuando la transacción se confirme
  React.useEffect(() => {
    if (isConfirmed) {
      refetchGanador();
    }
  }, [isConfirmed, refetchGanador]);

  // Función para generar ganador
  const onGenerarGanador = async () => {
    try {
      setErrorMessage("");

      console.log("🎰 Generando ganador...");

      writeContract({
        address: LOTTERY_ADDRESS,
        abi: LotteryABI.abi,
        functionName: "generarGanador",
      });
    } catch (error: any) {
      console.error("❌ Error al generar ganador:", error);
      const errorMsg =
        error?.shortMessage ||
        error?.message ||
        "Error desconocido al generar el ganador";
      setErrorMessage(errorMsg);
    }
  };

  // Formatear dirección para mostrar
  const formatAddress = (addr: string) => {
    if (!addr || addr === "0x0000000000000000000000000000000000000000") {
      return null;
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const ganadorExiste =
    ganadorAddress &&
    ganadorAddress !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Emisión de Premio al Ganador
        </h1>
        <p className="text-gray-400">
          Sistema de Selección del Ganador de la Lotería
        </p>
      </div>

      {/* Card de Generación de Ganador */}
      <Card className="bg-gray-900/50 border border-gray-800 mb-6">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎰</div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Generar Ganador de la Lotería
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Solo el propietario del contrato puede ejecutar esta acción
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          {!mounted || !isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {!mounted
                  ? "Cargando..."
                  : "Conecta tu wallet para generar el ganador"}
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Mensajes de estado */}
              {isGeneracionSuccess && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="text-green-300 font-semibold">
                        ¡Ganador generado exitosamente!
                      </p>
                      <p className="text-sm text-gray-400">
                        El premio ha sido distribuido al ganador
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
                      Requisitos para generar ganador:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>
                        • Solo el propietario (owner) del contrato puede
                        ejecutar esta función
                      </li>
                      <li>
                        • Debe haber al menos 1 boleto comprado en la lotería
                      </li>
                      <li>• El ganador recibirá el 95% del pool de premios</li>
                      <li>• El owner recibirá el 5% restante como comisión</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Información del proceso */}
              <div className="mb-6 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <div className="flex-1 text-xs text-gray-300">
                      <p className="font-semibold text-purple-300 mb-1">
                        ¿Cómo funciona el proceso?
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          Se selecciona aleatoriamente un boleto de todos los
                          comprados
                        </li>
                        <li>
                          El propietario de ese boleto se convierte en el
                          ganador
                        </li>
                        <li>
                          Se transfiere automáticamente el 95% del pool al
                          ganador
                        </li>
                        <li>El 5% restante se envía al owner del contrato</li>
                        <li>
                          La dirección del ganador se registra en el contrato
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de generación */}
              <Button
                onClick={onGenerarGanador}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg py-6 shadow-lg shadow-green-500/30 transition-all"
                size="lg"
                isLoading={isPending || isConfirming}
                isDisabled={isPending || isConfirming}
              >
                {isPending
                  ? "Esperando aprobación..."
                  : isConfirming
                  ? "Confirmando..."
                  : "🎰 Generar Ganador"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Card de Información del Ganador */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Ganador de la Lotería
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Información del último ganador registrado
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          {!mounted || !isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {!mounted
                  ? "Cargando..."
                  : "Conecta tu wallet para ver el ganador"}
              </p>
            </div>
          ) : loadingGanador ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="text-gray-400 mt-3">
                Cargando información del ganador...
              </p>
            </div>
          ) : !ganadorExiste ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sin ganador aún
              </h3>
              <p className="text-gray-400 mb-6">
                Todavía no se ha generado un ganador para la lotería
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-300">
                  💡 El propietario del contrato debe ejecutar la función
                  "Generar Ganador" cuando haya boletos comprados
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Información del ganador */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-6xl">🎉</div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-6">
                  ¡Felicidades al Ganador!
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Dirección del Ganador:
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-green-300 font-mono font-bold text-sm">
                          {formatAddress(ganadorAddress as string)}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {ganadorAddress as string}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Estado del Premio:
                      </span>
                      <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs font-semibold text-green-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Distribuido
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Porcentaje del Premio:
                      </span>
                      <span className="text-white font-bold">95% del pool</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-blue-300 font-semibold text-sm mb-1">
                      Sobre el ganador:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>
                        • Esta dirección fue seleccionada aleatoriamente del
                        pool de boletos
                      </li>
                      <li>
                        • El premio (95% del pool) fue transferido
                        automáticamente
                      </li>
                      <li>
                        • La información del ganador queda registrada en el
                        blockchain
                      </li>
                      <li>
                        • Puedes verificar la transacción en el explorador de
                        bloques
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
