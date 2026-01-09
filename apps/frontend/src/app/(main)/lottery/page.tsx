"use client";

import React from "react";
import { Card, CardBody, Link } from "@heroui/react";

export default function LotteryPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Sistema de lotería descentralizada
        </h1>
        <p className="text-gray-400">Compra de Boletos</p>
      </div>
      <div className="flex gap-4 mb-2">
        <Link color="secondary" href="/lottery/tokens">
          Balance de Tokens
        </Link>
        <Link color="success" href="/lottery/ganador">
          Emisión de Premio
        </Link>
      </div>
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎲</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Coming Soon
            </h2>
            <p className="text-gray-400">
              La funcionalidad de lotería estará disponible próximamente.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
