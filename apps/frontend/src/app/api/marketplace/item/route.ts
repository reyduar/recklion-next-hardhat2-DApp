import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { localhost } from "viem/chains";
import MarketplaceABI from "@/abis/Marketplace.json";

const publicClient = createPublicClient({
  chain: localhost,
  transport: http("http://127.0.0.1:7545"),
});

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const marketplaceAddress = process.env
      .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

    // Leer el item del contrato
    const item = (await publicClient.readContract({
      address: marketplaceAddress,
      abi: MarketplaceABI.abi,
      functionName: "items",
      args: [BigInt(itemId)],
    })) as any[];

    // Leer el precio total
    const totalPrice = (await publicClient.readContract({
      address: marketplaceAddress,
      abi: MarketplaceABI.abi,
      functionName: "getTotalPrice",
      args: [BigInt(itemId)],
    })) as bigint;

    // El struct Item retorna: [itemId, nft, tokenId, price, seller, sold]
    const itemData = {
      itemId: item[0].toString(),
      nft: item[1],
      tokenId: item[2].toString(),
      price: item[3].toString(),
      seller: item[4],
      sold: item[5],
      totalPrice: totalPrice.toString(),
    };

    return NextResponse.json(itemData);
  } catch (error: any) {
    console.error("Error reading item:", error);
    return NextResponse.json(
      { error: "Failed to read item", details: error.message },
      { status: 500 }
    );
  }
}
