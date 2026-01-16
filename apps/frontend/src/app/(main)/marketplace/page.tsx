"use client";
import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <ConnectButton />
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border border-[#383838] bg-[#202222] p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Marketplace</h2>
          <p className="text-gray-400 mb-6">
            This is the marketplace module. Functionality will be added here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/marketplace/create"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
            >
              <span className="text-4xl">✨</span>
              <span className="text-lg font-semibold">Crear NFT</span>
            </Link>

            <Link
              href="/marketplace/products"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
            >
              <span className="text-4xl">🛍️</span>
              <span className="text-lg font-semibold">Productos</span>
            </Link>

            <Link
              href="/marketplace/purchases"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
            >
              <span className="text-4xl">📦</span>
              <span className="text-lg font-semibold">Mis Compras</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
