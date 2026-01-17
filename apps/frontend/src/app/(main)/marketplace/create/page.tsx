"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Button,
  Progress,
  addToast,
} from "@heroui/react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import NFTContractABI from "@/abis/NFT.json";
import MarketplaceABI from "@/abis/Marketplace.json";

type CreateNFTForm = {
  name: string;
  description: string;
  price: string;
  file: FileList;
};

export default function CreateNFTPage() {
  const { address, isConnected } = useAccount();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [tokenURIToMint, setTokenURIToMint] = useState<string>("");
  const [priceToList, setPriceToList] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<
    "upload" | "mint" | "approve" | "list" | "done"
  >("upload");

  const nftContractAddress = process.env
    .NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`;
  const marketplaceAddress = process.env
    .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

  // Evitar hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateNFTForm>();

  const {
    data: txHash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Manejar el flujo de transacciones secuenciales
  useEffect(() => {
    if (isSuccess && receipt) {
      handleTransactionSuccess(receipt);
    }
  }, [isSuccess, receipt]);

  const handleTransactionSuccess = async (receipt: any) => {
    console.log("📝 Transaction receipt:", receipt);
    console.log("📝 Current step:", currentStep);

    try {
      if (currentStep === "mint") {
        console.log("🔍 Buscando evento Transfer en logs:", receipt.logs);

        // Extraer tokenId del evento Transfer del mint
        const transferEvent = receipt.logs.find((log: any) => {
          try {
            // El evento Transfer tiene estos topics: [eventSignature, from, to, tokenId]
            return (
              log.topics.length === 4 &&
              log.topics[0] ===
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            );
          } catch {
            return false;
          }
        });

        console.log("🔍 Transfer event encontrado:", transferEvent);

        if (!transferEvent) {
          throw new Error("No se pudo obtener el tokenId del NFT");
        }

        const tokenId = BigInt(transferEvent.topics[3]);
        console.log("✅ NFT minteado con tokenId:", tokenId.toString());

        // Paso siguiente: Aprobar el Marketplace
        setCurrentStep("approve");
        setUploadStep("Aprobando Marketplace...");

        writeContract({
          address: nftContractAddress,
          abi: NFTContractABI.abi,
          functionName: "approve",
          args: [marketplaceAddress, tokenId],
        });
      } else if (currentStep === "approve") {
        console.log("🔍 Buscando evento Approval en logs:", receipt.logs);

        // Extraer tokenId del evento Approval
        const approvalEvent = receipt.logs.find((log: any) => {
          try {
            return (
              log.topics.length === 4 &&
              log.topics[0] ===
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
            );
          } catch {
            return false;
          }
        });

        console.log("🔍 Approval event encontrado:", approvalEvent);

        if (!approvalEvent) {
          throw new Error("No se pudo confirmar la aprobación");
        }

        const tokenId = BigInt(approvalEvent.topics[3]);
        console.log(
          "✅ Marketplace aprobado para tokenId:",
          tokenId.toString()
        );

        // Paso final: Listar en el Marketplace
        setCurrentStep("list");
        setUploadStep("Listando en Marketplace...");

        console.log("📤 Llamando makeItem con:", {
          nft: nftContractAddress,
          tokenId: tokenId.toString(),
          price: priceToList,
          priceWei: parseEther(priceToList).toString(),
        });

        writeContract({
          address: marketplaceAddress,
          abi: MarketplaceABI.abi,
          functionName: "makeItem",
          args: [nftContractAddress, tokenId, parseEther(priceToList)],
        });
      } else if (currentStep === "list") {
        console.log("✅ NFT listado en Marketplace!");

        // ¡Éxito total!
        setCurrentStep("done");
        addToast({
          title: "¡NFT creado exitosamente!",
          description: "Tu NFT está listado en el Marketplace",
          color: "success",
        });
        reset();
        setImagePreview("");
        setTokenURIToMint("");
        setPriceToList("");
        setCurrentStep("upload");
        setUploadStep("");
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error("Error en flujo de transacciones:", error);
      addToast({
        title: "Error",
        description: error.message || "Error en el proceso",
        color: "danger",
      });
      setCurrentStep("upload");
      setIsUploading(false);
      setUploadStep("");
    }
  };

  // Mostrar errores
  useEffect(() => {
    if (writeError) {
      console.error("Error:", writeError);
      addToast({
        title: "Error en transacción",
        description: writeError.message,
        color: "danger",
      });
    }
  }, [writeError]);

  // Preview de imagen
  const fileWatch = watch("file");
  useEffect(() => {
    if (fileWatch && fileWatch[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(fileWatch[0]);
    }
  }, [fileWatch]);

  // Función principal para crear NFT
  const onSubmit = async (data: CreateNFTForm) => {
    if (!isConnected) {
      addToast({
        title: "Wallet no conectada",
        description: "Por favor conecta tu wallet para crear NFTs",
        color: "warning",
      });
      return;
    }

    if (!data.file || data.file.length === 0) {
      addToast({
        title: "Falta archivo",
        description: "Por favor selecciona una imagen para tu NFT",
        color: "warning",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Paso 1: Subir imagen a IPFS
      setUploadStep("Subiendo imagen a IPFS...");
      const formData = new FormData();
      formData.append("file", data.file[0]);

      const uploadRes = await fetch("/api/pinata/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error("Upload error:", errorData);
        throw new Error(errorData.details || "Error al subir imagen");
      }

      const { ipfs: imageIpfs } = await uploadRes.json();
      console.log("✅ Imagen subida:", imageIpfs);

      // Paso 2: Crear y subir metadata
      setUploadStep("Creando metadata NFT...");
      const metadata = {
        name: data.name,
        description: data.description,
        image: imageIpfs,
        attributes: [
          {
            trait_type: "Price",
            value: `${data.price} ETH`,
          },
        ],
      };

      const metadataRes = await fetch("/api/pinata/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (!metadataRes.ok) {
        const errorData = await metadataRes.json();
        console.error("Metadata error:", errorData);
        throw new Error(
          errorData.details || errorData.error || "Error al subir metadata"
        );
      }

      const { tokenURI } = await metadataRes.json();
      console.log("✅ Metadata creada:", tokenURI);

      // Guardar datos para usar después de mint
      setTokenURIToMint(tokenURI);
      setPriceToList(data.price);

      // Paso 3: Mint NFT en el contrato
      setCurrentStep("mint");
      setUploadStep("Creando NFT en blockchain...");
      writeContract({
        address: nftContractAddress,
        abi: NFTContractABI.abi,
        functionName: "mint",
        args: [tokenURI],
      });
    } catch (error: any) {
      console.error("❌ Error:", error);
      addToast({
        title: "Error al crear NFT",
        description: error.message || "Ocurrió un error",
        color: "danger",
      });
      setCurrentStep("upload");
      setIsUploading(false);
      setUploadStep("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Crear NFT</h1>
        <Link
          href="/marketplace"
          className="px-4 py-2 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
        >
          ← Volver al Home
        </Link>
      </div>

      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Crear nuevo NFT
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Sube tu archivo y completa los datos para mintear tu NFT
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
              <p className="text-gray-400">Conecta tu wallet para crear NFTs</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Preview de imagen */}
              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-gray-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Input de archivo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Archivo (Imagen/Video) *
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  {...register("file", {
                    required: "El archivo es obligatorio",
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {errors.file && (
                  <p className="text-red-500 text-sm">{errors.file.message}</p>
                )}
              </div>

              {/* Nombre del NFT */}
              <Input
                label="Nombre del NFT"
                placeholder="Ej: Mi Primera Obra de Arte"
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres",
                  },
                })}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-700 bg-gray-800",
                }}
              />

              {/* Descripción */}
              <Textarea
                label="Descripción"
                placeholder="Describe tu NFT..."
                {...register("description", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 10,
                    message: "Mínimo 10 caracteres",
                  },
                })}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                variant="bordered"
                minRows={4}
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-700 bg-gray-800",
                }}
              />

              {/* Precio */}
              <Input
                label="Precio (ETH)"
                placeholder="0.01"
                type="number"
                step="0.001"
                {...register("price", {
                  required: "El precio es obligatorio",
                  min: {
                    value: 0.001,
                    message: "Precio mínimo 0.001 ETH",
                  },
                })}
                isInvalid={!!errors.price}
                errorMessage={errors.price?.message}
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-700 bg-gray-800",
                }}
              />

              {/* Información del proceso */}
              {(isUploading || isPending || isConfirming) && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <Progress color="primary" isIndeterminate className="mb-2" />
                  <p className="text-blue-300 text-sm font-medium">
                    {uploadStep || "Procesando transacción..."}
                  </p>
                  {currentStep !== "upload" && (
                    <p className="text-gray-400 text-xs mt-2">
                      Paso{" "}
                      {currentStep === "mint"
                        ? "1"
                        : currentStep === "approve"
                        ? "2"
                        : "3"}{" "}
                      de 3
                    </p>
                  )}
                </div>
              )}

              {/* Botón de submit */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-semibold"
                isDisabled={isUploading || isPending || isConfirming}
              >
                {isUploading || isPending || isConfirming
                  ? "Creando NFT..."
                  : "Crear y Listar NFT"}
              </Button>

              {/* Información adicional */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-yellow-300 font-semibold text-sm mb-1">
                      Proceso de creación:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>1. Tu archivo se sube a IPFS mediante Pinata</li>
                      <li>2. La metadata se crea y sube a IPFS</li>
                      <li>3. Se mintea el NFT en el contrato</li>
                      <li>
                        4. Se aprueba el Marketplace para transferir el NFT
                      </li>
                      <li>5. El NFT se lista en el Marketplace</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
