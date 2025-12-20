import fs from "fs";
import path from "path";

const DEPLOYMENTS_FILE = path.join(__dirname, "../deployments.json");

export interface Deployments {
  [network: string]: {
    [contractName: string]: {
      address: string;
      deployer: string;
      timestamp: number;
      blockNumber?: number;
    };
  };
}

/**
 * Lee el archivo de deployments
 */
export function readDeployments(): Deployments {
  if (!fs.existsSync(DEPLOYMENTS_FILE)) {
    return {};
  }
  const data = fs.readFileSync(DEPLOYMENTS_FILE, "utf-8");
  return JSON.parse(data);
}

/**
 * Guarda un deployment en el archivo
 */
export function saveDeployment(
  network: string,
  contractName: string,
  address: string,
  deployer: string,
  blockNumber?: number
) {
  const deployments = readDeployments();

  if (!deployments[network]) {
    deployments[network] = {};
  }

  deployments[network][contractName] = {
    address,
    deployer,
    timestamp: Date.now(),
    blockNumber,
  };

  fs.writeFileSync(DEPLOYMENTS_FILE, JSON.stringify(deployments, null, 2));
  console.log(`💾 Saved ${contractName} deployment to ${network}`);
}

/**
 * Obtiene la dirección de un contrato desplegado
 */
export function getDeployment(
  network: string,
  contractName: string
): string | undefined {
  const deployments = readDeployments();
  return deployments[network]?.[contractName]?.address;
}

/**
 * Verifica si un contrato ya está desplegado en la red
 */
export function isDeployed(network: string, contractName: string): boolean {
  return !!getDeployment(network, contractName);
}

/**
 * Muestra todos los deployments de una red
 */
export function printDeployments(network: string) {
  const deployments = readDeployments();
  const networkDeployments = deployments[network];

  if (!networkDeployments || Object.keys(networkDeployments).length === 0) {
    console.log(`\n📭 No deployments found for ${network}\n`);
    return;
  }

  console.log(`\n📦 Deployments on ${network}:`);
  console.log("─".repeat(80));
  for (const [contract, info] of Object.entries(networkDeployments)) {
    console.log(`✅ ${contract.padEnd(20)} ${info.address}`);
  }
  console.log("─".repeat(80) + "\n");
}
