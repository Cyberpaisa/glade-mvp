const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying GLADE contracts on", hre.network.name);
  console.log("Deployer:", deployer.address);

  const GladeToken = await hre.ethers.getContractFactory("GladeToken");
  const token = await GladeToken.deploy();
  await token.waitForDeployment();
  console.log("GladeToken:", await token.getAddress());

  const GladeFarm = await hre.ethers.getContractFactory("GladeFarm");
  const farm = await GladeFarm.deploy(await token.getAddress(), deployer.address, deployer.address);
  await farm.waitForDeployment();
  console.log("GladeFarm:", await farm.getAddress());

  console.log("\nGLADE deployed! Add addresses to .env");
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
