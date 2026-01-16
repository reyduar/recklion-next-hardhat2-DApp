"use client";
import React from "react";
import Link from "next/link";

export default function CreateNFTPage() {
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

      <div className="grid gap-4">
        <div className="rounded-lg border border-[#383838] bg-[#202222] p-6">
          <h2 className="text-xl font-semibold mb-4">Crear nuevo NFT</h2>
          <p className="text-gray-400">
            Aquí se implementará la funcionalidad para crear NFTs.
          </p>
        </div>
      </div>
    </div>
  );
}
