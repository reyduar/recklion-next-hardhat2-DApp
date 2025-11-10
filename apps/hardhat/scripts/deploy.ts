import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Damc = await hre.ethers.getContractFactory("DamcStakedToken");
  const Rey = await hre.ethers.getContractFactory("ReyRewardToken");
  const Chef = await hre.ethers.getContractFactory("MasterChefToken");

  const damc = await Damc.deploy();
  await damc.waitForDeployment();

  const rey = await Rey.deploy();
  await rey.waitForDeployment();

  const chef = await Chef.deploy(
    await damc.getAddress(),
    await rey.getAddress()
  );
  await chef.waitForDeployment();

  console.log("✅ Damc:", await damc.getAddress());
  console.log("✅ Rey :", await rey.getAddress());
  console.log("✅ Chef:", await chef.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
