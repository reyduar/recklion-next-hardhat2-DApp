import hre from "hardhat";
import {
  saveDeployment,
  getDeployment,
  isDeployed,
  printDeployments,
} from "./deployment-utils";

/**
 * Script para desplegar los contratos Marketplace (NFT + Marketplace)
 * Solo despliega los que no existan en la red actual
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("\n🚀 Deploying Marketplace Contracts");
  console.log("─".repeat(80));
  console.log("Network:", network);
  console.log("Deployer:", deployer.address);
  console.log("─".repeat(80) + "\n");

  let nftAddress: string;
  let marketplaceAddress: string;

  // ============ NFT Contract ============
  if (isDeployed(network, "NFT")) {
    nftAddress = getDeployment(network, "NFT")!;
    console.log("✓ NFT already deployed:", nftAddress);
  } else {
    console.log("⏳ Deploying NFT...");
    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();
    nftAddress = await nft.getAddress();

    const receipt = await nft.deploymentTransaction()?.wait();
    saveDeployment(
      network,
      "NFT",
      nftAddress,
      deployer.address,
      receipt?.blockNumber
    );
    console.log("✅ NFT deployed:", nftAddress);
  }

  // ============ Marketplace Contract ============
  const feePercent = 1; // 1% fee

  if (isDeployed(network, "Marketplace")) {
    marketplaceAddress = getDeployment(network, "Marketplace")!;
    console.log("✓ Marketplace already deployed:", marketplaceAddress);
  } else {
    console.log("⏳ Deploying Marketplace...");
    console.log(`   Fee Percent: ${feePercent}%`);
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(feePercent);
    await marketplace.waitForDeployment();
    marketplaceAddress = await marketplace.getAddress();

    const receipt = await marketplace.deploymentTransaction()?.wait();
    saveDeployment(
      network,
      "Marketplace",
      marketplaceAddress,
      deployer.address,
      receipt?.blockNumber
    );
    console.log("✅ Marketplace deployed:", marketplaceAddress);
  }

  // Mostrar resumen
  printDeployments(network);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
