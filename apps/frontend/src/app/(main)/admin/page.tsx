"use client";

import { Card, CardBody, CardHeader, Divider, Code } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  HiChevronDown,
  HiChevronRight,
  HiCube,
  HiCommandLine,
  HiCog,
  HiDocumentText,
} from "react-icons/hi2";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function Admin() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro"]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const sections: Section[] = [
    {
      id: "intro",
      title: "📖 ¿Qué es este proyecto?",
      icon: <HiDocumentText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Imaginate que tenés una alcancía mágica: cuando ponés tus monedas
            adentro, esa alcancía te regala más monedas como premio por
            guardarlas ahí.{" "}
            <strong>
              Eso es exactamente lo que hace este proyecto, pero con
              criptomonedas en internet.
            </strong>
          </p>
          <p className="text-gray-300 leading-relaxed">
            Este es un proyecto completo de{" "}
            <strong>DeFi (Finanzas Descentralizadas)</strong> con dos sistemas
            principales:
          </p>

          {/* DeFi Staking */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
              💰 Sistema de Staking DeFi
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 text-sm">
              <li>
                <strong>Hacer Staking</strong> - Guardar tokens DAMC y ganar
                recompensas
              </li>
              <li>
                <strong>Recibir REY</strong> - Tokens de recompensa automáticos
              </li>
              <li>
                <strong>Retirar tokens</strong> - Disponibles cuando quieras
              </li>
              <li>
                <strong>Dashboard en tiempo real</strong> - Ver balances
                conectando MetaMask
              </li>
            </ul>
          </div>

          {/* Lottery System */}
          <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-lg p-4">
            <h4 className="text-orange-300 font-semibold mb-2 flex items-center gap-2">
              🎰 Sistema de Lotería
            </h4>
            <p className="text-gray-300 text-sm mb-3">
              Una lotería descentralizada donde los usuarios compran boletos con
              tokens y tienen chance de ganar el premio acumulado:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 text-sm">
              <li>
                <strong>Comprar tokens RELO</strong> - Cambiar ETH por tokens de
                la lotería
              </li>
              <li>
                <strong>Comprar boletos</strong> - Cada boleto cuesta 5 RELO y
                genera un NFT único
              </li>
              <li>
                <strong>Sistema de NFTs</strong> - Cada boleto es un NFT
                coleccionable con número aleatorio
              </li>
              <li>
                <strong>Sorteo transparente</strong> - El owner ejecuta un
                sorteo aleatorio on-chain
              </li>
              <li>
                <strong>Premio automático</strong> - El ganador recibe el 95%
                del pool y el owner el 5%
              </li>
              <li>
                <strong>Devolver tokens</strong> - Cambiar RELO de vuelta a ETH
                si no querés jugar
              </li>
            </ul>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-2 mt-3">
              <p className="text-xs text-orange-200">
                💡 <strong>Transparencia total:</strong> Todo el código es
                público y verificable. Los números aleatorios se generan usando
                el hash del bloque, garantizando equidad.
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
            <p className="text-blue-300 text-sm">
              Todo funciona en la{" "}
              <strong>red blockchain de Polygon Amoy</strong> (una red de prueba
              gratuita) y está construido con tecnologías modernas y seguras.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "architecture",
      title: "🏗️ Arquitectura del Proyecto",
      icon: <HiCube className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Este proyecto es un <strong>monorepo</strong>, lo que significa que
            es como una casa con dos pisos:
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
            <pre>{`📦 recklion-next-hardhat2-DApp01/
├── 📁 apps/
│   ├── 🔨 hardhat/          ← Piso 1: Los contratos inteligentes (backend blockchain)
│   └── 🎨 frontend/         ← Piso 2: La interfaz web (lo que ven los usuarios)
└── 📄 package.json          ← El archivo que conecta ambos pisos`}</pre>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <Card className="bg-purple-500/10 border border-purple-500/20">
              <CardHeader className="pb-2">
                <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                  🔨 Piso 1: Hardhat
                </h4>
              </CardHeader>
              <CardBody>
                <p className="text-gray-300 text-sm mb-3">
                  Backend Blockchain - Donde construimos los contratos
                  inteligentes
                </p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• Hardhat v2.27.0</li>
                  <li>• Solidity v0.8.4</li>
                  <li>• Ethers.js v6.15.0</li>
                  <li>• TypeScript</li>
                </ul>
              </CardBody>
            </Card>

            <Card className="bg-pink-500/10 border border-pink-500/20">
              <CardHeader className="pb-2">
                <h4 className="text-pink-300 font-semibold flex items-center gap-2">
                  🎨 Piso 2: Frontend
                </h4>
              </CardHeader>
              <CardBody>
                <p className="text-gray-300 text-sm mb-3">
                  Interfaz Web - Lo que ven los usuarios
                </p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• Next.js v16.0.1</li>
                  <li>• React v19.2.0</li>
                  <li>• Wagmi v2.19.2</li>
                  <li>• Tailwind CSS v3.4</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "contracts",
      title: "🎯 Los 4 Contratos Inteligentes",
      icon: <HiCube className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          {/* DamcStakedToken */}
          <Card className="bg-gray-800/30 border border-gray-700">
            <CardHeader className="flex gap-3">
              <div className="text-2xl">🪙</div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white">
                  1. DamcStakedToken (DAMC)
                </p>
                <p className="text-sm text-gray-400">
                  El token que los usuarios guardan para hacer staking
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Nombre:</span>{" "}
                  <Code size="sm">DamC Token</Code>
                </div>
                <div>
                  <span className="text-gray-500">Símbolo:</span>{" "}
                  <Code size="sm">DAMC</Code>
                </div>
                <div>
                  <span className="text-gray-500">Supply:</span>{" "}
                  <Code size="sm">1,000,000</Code>
                </div>
                <div>
                  <span className="text-gray-500">Decimales:</span>{" "}
                  <Code size="sm">18</Code>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">
                  Funciones principales:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Code size="sm" className="bg-gray-700">
                    transfer()
                  </Code>
                  <Code size="sm" className="bg-gray-700">
                    approve()
                  </Code>
                  <Code size="sm" className="bg-gray-700">
                    transferFrom()
                  </Code>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* ReyRewardToken */}
          <Card className="bg-gray-800/30 border border-gray-700">
            <CardHeader className="flex gap-3">
              <div className="text-2xl">👑</div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white">
                  2. ReyRewardToken (REY)
                </p>
                <p className="text-sm text-gray-400">
                  El token de recompensa que reciben los stakers
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Nombre:</span>{" "}
                  <Code size="sm">Rey Token</Code>
                </div>
                <div>
                  <span className="text-gray-500">Símbolo:</span>{" "}
                  <Code size="sm">REY</Code>
                </div>
                <div>
                  <span className="text-gray-500">Supply:</span>{" "}
                  <Code size="sm">1,000,000</Code>
                </div>
                <div>
                  <span className="text-gray-500">Decimales:</span>{" "}
                  <Code size="sm">18</Code>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* MasterChefToken */}
          <Card className="bg-gray-800/30 border border-gray-700">
            <CardHeader className="flex gap-3">
              <div className="text-2xl">👨‍🍳</div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white">
                  3. MasterChefToken (El Jefe del Staking)
                </p>
                <p className="text-sm text-gray-400">
                  El contrato principal que maneja todo el sistema
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              <div className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">
                  Funciones principales:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Code size="sm" className="bg-green-500/20 text-green-300">
                      stakeTokens()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Depositar tokens DAMC
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code
                      size="sm"
                      className="bg-orange-500/20 text-orange-300"
                    >
                      unstakeTokens()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Retirar tokens DAMC
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code
                      size="sm"
                      className="bg-purple-500/20 text-purple-300"
                    >
                      issueTokens()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Distribuir recompensas REY (solo owner)
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Lottery */}
          <Card className="bg-gray-800/30 border border-gray-700">
            <CardHeader className="flex gap-3">
              <div className="text-2xl">🎰</div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white">
                  4. Lottery (Sistema de Lotería)
                </p>
                <p className="text-sm text-gray-400">
                  Contrato de lotería con tokens ERC20 y NFTs
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Token:</span>{" "}
                  <Code size="sm">RELO</Code>
                </div>
                <div>
                  <span className="text-gray-500">NFT:</span>{" "}
                  <Code size="sm">NELO</Code>
                </div>
                <div>
                  <span className="text-gray-500">Supply Inicial:</span>{" "}
                  <Code size="sm">1,000</Code>
                </div>
                <div>
                  <span className="text-gray-500">Precio Boleto:</span>{" "}
                  <Code size="sm">5 RELO</Code>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">
                  Funciones principales:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Code size="sm" className="bg-green-500/20 text-green-300">
                      compraTokens()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Comprar tokens RELO con ETH
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code size="sm" className="bg-blue-500/20 text-blue-300">
                      compraBoleto()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Comprar boletos de lotería con RELO
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code
                      size="sm"
                      className="bg-purple-500/20 text-purple-300"
                    >
                      generarGanador()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Seleccionar ganador (solo owner)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code
                      size="sm"
                      className="bg-orange-500/20 text-orange-300"
                    >
                      devolverTokens()
                    </Code>
                    <span className="text-xs text-gray-400">
                      - Devolver tokens RELO por ETH
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-300">
                  💡 <strong>Incluye 3 contratos:</strong> Lottery (principal),
                  mainERC721 (NFTs de boletos), y boletosNFTs (contrato personal
                  por usuario)
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      ),
    },
    {
      id: "deploy",
      title: "🔧 Cómo Desplegar los Contratos",
      icon: <HiCommandLine className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            {/* Paso 1 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="text-white font-semibold mb-2">
                Paso 1: Configurar el Entorno
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Creá un archivo <Code size="sm">.env</Code> en{" "}
                <Code size="sm">apps/hardhat/</Code>:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">{`# Tu frase semilla de 12 palabras de MetaMask
MNEMONIC="tu frase semilla de 12 palabras aqui"

# URL del RPC de Polygon Amoy
RPC_AMOY="https://rpc-amoy.polygon.technology"`}</pre>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="text-white font-semibold mb-2">
                Paso 2: Instalar Dependencias
              </h4>
              <div className="bg-gray-900 rounded-lg p-4">
                <Code size="sm" className="text-cyan-400">
                  npm install
                </Code>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="text-white font-semibold mb-2">
                Paso 3: Compilar los Contratos
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                <Code size="sm" className="text-cyan-400">
                  cd apps/hardhat
                </Code>
                <br />
                <Code size="sm" className="text-cyan-400">
                  npm run compile
                </Code>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="text-white font-semibold mb-2">
                Paso 4: Sistema Modular de Despliegue
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                El proyecto tiene un sistema modular que permite desplegar
                contratos de forma independiente:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-purple-300 font-semibold mb-2">
                    📦 Desplegar TODO (primera vez)
                  </p>
                  <Code size="sm" className="text-cyan-400">
                    npm run deploy:amoy
                  </Code>
                  <p className="text-xs text-gray-500 mt-1">
                    Despliega todos los contratos (DeFi + Lottery)
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-green-300 font-semibold mb-2">
                    💰 Desplegar solo DeFi
                  </p>
                  <Code size="sm" className="text-cyan-400">
                    npm run deploy:defi:amoy
                  </Code>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo Damc, Rey, Chef + copia sus ABIs
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-blue-300 font-semibold mb-2">
                    🎰 Desplegar solo Lottery
                  </p>
                  <Code size="sm" className="text-cyan-400">
                    npm run deploy:lottery:amoy
                  </Code>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo Lottery + mainERC721 + copia sus ABIs
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-300">
                  ✨ <strong>Detección Inteligente:</strong> No redespliega
                  contratos que ya existen. Guarda direcciones en{" "}
                  <Code size="sm">deployments.json</Code>
                </p>
              </div>
            </div>

            {/* Paso 5 */}
            <div className="border-l-4 border-pink-500 pl-4">
              <h4 className="text-white font-semibold mb-2">
                Paso 5: Verificar las Direcciones
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Las direcciones se guardan automáticamente en{" "}
                <Code size="sm">deployments.json</Code>. Copiá las que necesites
                a <Code size="sm">apps/frontend/.env.local</Code>:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">{`# DeFi Contracts
NEXT_PUBLIC_DAMC_ADDRESS="0xABC123..."
NEXT_PUBLIC_REY_ADDRESS="0xDEF456..."
NEXT_PUBLIC_CHEF_ADDRESS="0xGHI789..."

# Lottery Contracts
NEXT_PUBLIC_LOTTERY_ADDRESS="0x9b1202..."
NEXT_PUBLIC_LOTTERY_NFT_ADDRESS="0x5a9a18..."`}</pre>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tech-stack",
      title: "🌟 Stack Tecnológico",
      icon: <HiCog className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-400 font-semibold">
                    Capa
                  </th>
                  <th className="text-left py-2 px-3 text-gray-400 font-semibold">
                    Tecnología
                  </th>
                  <th className="text-left py-2 px-3 text-gray-400 font-semibold">
                    Versión
                  </th>
                  <th className="text-left py-2 px-3 text-gray-400 font-semibold">
                    Propósito
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  [
                    "Blockchain",
                    "Polygon Amoy",
                    "Testnet",
                    "Red de despliegue",
                  ],
                  [
                    "Smart Contracts",
                    "Solidity",
                    "0.8.4",
                    "Lenguaje de contratos",
                  ],
                  [
                    "Entorno Dev",
                    "Hardhat",
                    "2.27.0",
                    "Compilación y despliegue",
                  ],
                  [
                    "Web3 Lib",
                    "Ethers.js",
                    "6.15.0",
                    "Interacción con blockchain",
                  ],
                  ["Frontend", "Next.js", "16.0.1", "Framework React"],
                  ["UI Lib", "React", "19.2.0", "Biblioteca de componentes"],
                  ["Web3 React", "Wagmi", "2.19.2", "Hooks de blockchain"],
                  ["Wallet", "RainbowKit", "2.2.9", "Conexión de wallets"],
                  ["Estilos", "Tailwind CSS", "3.4", "Framework CSS"],
                  ["Components", "HeroUI", "2.8.5", "Componentes React"],
                ].map(([capa, tech, version, proposito], i) => (
                  <tr key={i} className="hover:bg-gray-800/30">
                    <td className="py-2 px-3 text-gray-400 font-medium">
                      {capa}
                    </td>
                    <td className="py-2 px-3 text-white">{tech}</td>
                    <td className="py-2 px-3">
                      <Code size="sm">{version}</Code>
                    </td>
                    <td className="py-2 px-3 text-gray-400 text-xs">
                      {proposito}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/defi">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Recklion DApp DeFi de Staking
            </h1>
            <p className="text-gray-400">Ariel Duarte - 2025</p>
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <Card
              key={section.id}
              className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">{section.icon}</div>
                    <h2 className="text-xl font-semibold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? (
                      <HiChevronDown className="w-5 h-5" />
                    ) : (
                      <HiChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <>
                  <Divider />
                  <CardBody className="pt-4">{section.content}</CardBody>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center pb-8">
        <p className="text-gray-500 text-sm">¡Feliz staking! 🚀🎁</p>
        <p className="text-gray-600 text-xs mt-2">
          Proyecto creado con ❤️ por Ariel Duarte
        </p>
      </div>
    </div>
  );
}
