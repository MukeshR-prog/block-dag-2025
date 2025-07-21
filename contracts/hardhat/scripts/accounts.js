const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  console.log("Available accounts:");
  for (let i = 0; i < signers.length; i++) {
    const balance = await signers[i].getBalance();
    console.log(`Account ${i}:`, signers[i].address);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} BDAG`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
