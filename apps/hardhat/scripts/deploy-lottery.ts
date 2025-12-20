import hre from "hardhat";
import {
  saveDeployment,
  getDeployment,
  isDeployed,
  printDeployments,
} from "./deployment-utils";

/**
 * Script para desplegar el contrato Lottery
 * Solo despliega si no existe en la red actual
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("\n🎰 Deploying Lottery Contract");
  console.log("─".repeat(80));
  console.log("Network:", network);
  console.log("Deployer:", deployer.address);
  console.log("─".repeat(80) + "\n");

  // ============ Lottery ============
  if (isDeployed(network, "Lottery")) {
    const lotteryAddress = getDeployment(network, "Lottery")!;
    console.log("✓ Lottery already deployed:", lotteryAddress);
    console.log(
      "\n⚠️  If you want to redeploy, delete the entry from deployments.json\n"
    );
  } else {
    console.log("⏳ Deploying Lottery...");
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy();
    await lottery.waitForDeployment();
    const lotteryAddress = await lottery.getAddress();

    const receipt = await lottery.deploymentTransaction()?.wait();
    saveDeployment(
      network,
      "Lottery",
      lotteryAddress,
      deployer.address,
      receipt?.blockNumber
    );
    console.log("✅ Lottery deployed:", lotteryAddress);

    // Obtener las direcciones de los contratos internos creados
    const nftAddress = await lottery.nft();
    console.log("✅ mainERC721 NFT deployed:", nftAddress);

    // Guardar también la dirección del NFT
    saveDeployment(
      network,
      "LotteryNFT",
      nftAddress,
      deployer.address,
      receipt?.blockNumber
    );
  }

  // Mostrar resumen
  printDeployments(network);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
