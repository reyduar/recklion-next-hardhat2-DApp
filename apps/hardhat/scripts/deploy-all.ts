import hre from "hardhat";
import { printDeployments } from "./deployment-utils";

/**
 * Script principal que despliega TODOS los contratos
 * Útil para despliegue inicial en una red nueva
 */
async function main() {
  const network = hre.network.name;

  console.log("\n🚀 Deploying ALL Contracts");
  console.log("═".repeat(80));
  console.log("Network:", network);
  console.log("═".repeat(80) + "\n");

  // Importar y ejecutar los scripts modulares
  console.log("📦 Step 1/2: Deploying DeFi Contracts...\n");
  await import("./deploy-defi");

  console.log("\n📦 Step 2/2: Deploying Lottery Contract...\n");
  await import("./deploy-lottery");

  // Mostrar resumen final
  console.log("\n" + "═".repeat(80));
  console.log("✅ ALL CONTRACTS DEPLOYED");
  console.log("═".repeat(80));
  printDeployments(network);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
