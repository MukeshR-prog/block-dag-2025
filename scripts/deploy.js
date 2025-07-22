const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting CardSmart deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance));

  console.log("📦 Deploying CardSmart contract...");
  const CardSmart = await ethers.getContractFactory("CardSmart");
  const cardSmart = await CardSmart.deploy();

  console.log("⏳ Waiting for deployment...");
  await cardSmart.waitForDeployment();

  const address = await cardSmart.getAddress();
  console.log("✅ CardSmart deployed to:", address);

  console.log("👤 Registering deployer as user...");
  const tx = await cardSmart.registerUser(deployer.address);
  await tx.wait();
  console.log("✅ User registered successfully!");

  console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("Contract Address:", address);
  
  return { address, deployer: deployer.address };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
