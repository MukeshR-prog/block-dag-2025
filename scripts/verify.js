const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Read deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`❌ Deployment file not found: ${deploymentFile}`);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("🔍 Verifying contract on block explorer...");
  console.log("📍 Contract address:", deploymentInfo.contractAddress);
  console.log("🌐 Network:", deploymentInfo.network);

  try {
    await run("verify:verify", {
      address: deploymentInfo.contractAddress,
      constructorArguments: [], // CardSmart constructor takes no arguments
    });
    
    console.log("✅ Contract verified successfully!");
    
    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verificationTime = new Date().toISOString();
    
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment info updated with verification status");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error);
      throw error;
    }
  }
}

main()
  .then(() => {
    console.log("✅ Verification process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
