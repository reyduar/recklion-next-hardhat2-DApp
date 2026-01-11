import { http, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { defineChain } from "viem";

// Definir Ganache como una red personalizada
const ganache = defineChain({
  id: 1337,
  name: "Ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:7545"],
    },
  },
  testnet: true,
});

// Definir Polygon Amoy personalizado para evitar URL hardcodeada
// const polygonAmoy = defineChain({
//   id: 80002,
//   name: "Polygon Amoy",
//   nativeCurrency: {
//     decimals: 18,
//     name: "POL",
//     symbol: "POL",
//   },
//   rpcUrls: {
//     default: {
//       http: [
//         process.env.NEXT_PUBLIC_RPC_URL ||
//           "https://rpc-amoy.polygon.technology",
//       ],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "PolygonScan",
//       url: "https://amoy.polygonscan.com",
//     },
//   },
//   testnet: true,
// });

// Configuración dinámica según variables de entorno
const chainId = 1337;

const rpcUrl = "http://127.0.0.1:7545";

// Crear configuración según el chain seleccionado
export const config = createConfig({
  chains: [ganache],
  transports: {
    [ganache.id]: http(rpcUrl),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    }),
  ],
});
