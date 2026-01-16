"use client";
import React from "react";
import Link from "next/link";

export default function PurchasesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Compras</h1>
        <Link
          href="/marketplace"
          className="px-4 py-2 rounded-lg border border-[#383838] bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
        >
          ← Volver al Home
        </Link>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border border-[#383838] bg-[#202222] p-6">
          <h2 className="text-xl font-semibold mb-4">Historial de Compras</h2>
          <p className="text-gray-400">
            Aquí se mostrarán todos los NFTs que has comprado.
          </p>
        </div>
      </div>
    </div>
  );
}
