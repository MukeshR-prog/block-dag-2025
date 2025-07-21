const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.formatEther(balance));

  // Using provided addresses
  const seller = "0x2e6175270469DB613F985d3891609dC355A85747"; // Seller address
  const arbiter = "0xba4A2f39F1DE4F13A0905373F0129f0547f63c98"; // Arbiter address

  console.log("Using addresses:");
  console.log("Seller:", seller);
  console.log("Arbiter:", arbiter);

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(seller, arbiter, {
    value: hre.ethers.parseEther("0.1"), // Initial deposit amount in BDAG
  });

  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("Escrow deployed to:", escrowAddress);

  console.log("Deployment completed!");
  console.log("-----------------------------------");
  console.log("Contract:", escrowAddress);
  console.log("Seller:", seller);
  console.log("Arbiter:", arbiter);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
