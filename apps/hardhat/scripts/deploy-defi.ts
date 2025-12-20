import hre from "hardhat";
import {
  saveDeployment,
  getDeployment,
  isDeployed,
  printDeployments,
} from "./deployment-utils";

/**
 * Script para desplegar los contratos DeFi (Damc, Rey, Chef)
 * Solo despliega los que no existan en la red actual
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("\n🚀 Deploying DeFi Contracts");
  console.log("─".repeat(80));
  console.log("Network:", network);
  console.log("Deployer:", deployer.address);
  console.log("─".repeat(80) + "\n");

  let damcAddress: string;
  let reyAddress: string;
  let chefAddress: string;

  // ============ DAMC Token ============
  if (isDeployed(network, "DamcStakedToken")) {
    damcAddress = getDeployment(network, "DamcStakedToken")!;
    console.log("✓ DamcStakedToken already deployed:", damcAddress);
  } else {
    console.log("⏳ Deploying DamcStakedToken...");
    const Damc = await hre.ethers.getContractFactory("DamcStakedToken");
    const damc = await Damc.deploy();
    await damc.waitForDeployment();
    damcAddress = await damc.getAddress();

    const receipt = await damc.deploymentTransaction()?.wait();
    saveDeployment(
      network,
      "DamcStakedToken",
      damcAddress,
      deployer.address,
      receipt?.blockNumber
    );
    console.log("✅ DamcStakedToken deployed:", damcAddress);
  }

  // ============ REY Token ============
  if (isDeployed(network, "ReyRewardToken")) {
    reyAddress = getDeployment(network, "ReyRewardToken")!;
    console.log("✓ ReyRewardToken already deployed:", reyAddress);
  } else {
    console.log("⏳ Deploying ReyRewardToken...");
    const Rey = await hre.ethers.getContractFactory("ReyRewardToken");
    const rey = await Rey.deploy();
    await rey.waitForDeployment();
    reyAddress = await rey.getAddress();

    const receipt = await rey.deploymentTransaction()?.wait();
    saveDeployment(
      network,
      "ReyRewardToken",
      reyAddress,
      deployer.address,
      receipt?.blockNumber
    );
    console.log("✅ ReyRewardToken deployed:", reyAddress);
  }

  // ============ MasterChef ============
  if (isDeployed(network, "MasterChefToken")) {
    chefAddress = getDeployment(network, "MasterChefToken")!;
    console.log("✓ MasterChefToken already deployed:", chefAddress);
  } else {
    console.log("⏳ Deploying MasterChefToken...");
    const Chef = await hre.ethers.getContractFactory("MasterChefToken");
    const chef = await Chef.deploy(damcAddress, reyAddress);
    await chef.waitForDeployment();
    chefAddress = await chef.getAddress();

    const receipt = await chef.deploymentTransaction()?.wait();
    saveDeployment(
      network,
      "MasterChefToken",
      chefAddress,
      deployer.address,
      receipt?.blockNumber
    );
    console.log("✅ MasterChefToken deployed:", chefAddress);
  }

  // Mostrar resumen
  printDeployments(network);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
