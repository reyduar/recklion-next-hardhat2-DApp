"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";

export default function GanadorPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Ganador</h1>
        <p className="text-gray-400">Ganador</p>
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
