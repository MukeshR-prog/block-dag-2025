const { ethers } = require("hardhat");

async function checkDeployment() {
  console.log("🔍 Checking CardSmart deployment status...");
  console.log("=====================================");

  const provider = new ethers.JsonRpcProvider("https://rpc.primordial.bdagscan.com");
  const txHash = "0x33130e3f78882cd5d9dac51db8f066b0ed4e90cfbd674a6cfdbad91dc993a228";
  
  try {
    console.log("📄 Checking transaction:", txHash);
    
    // Check transaction
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      console.log("❌ Transaction not found");
      return;
    }
    
    console.log("✅ Transaction found!");
    console.log("📊 Block Number:", tx.blockNumber || "Pending");
    console.log("⛽ Gas Limit:", tx.gasLimit.toString());
    console.log("💰 Gas Price:", ethers.formatUnits(tx.gasPrice, "gwei"), "gwei");
    
    // Check receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      console.log("⏳ Transaction still pending...");
      return;
    }
    
    console.log("✅ Transaction confirmed!");
    console.log("📍 Contract Address:", receipt.contractAddress);
    console.log("🧱 Block Number:", receipt.blockNumber);
    console.log("⛽ Gas Used:", receipt.gasUsed.toString());
    console.log("✅ Status:", receipt.status === 1 ? "Success" : "Failed");
    
    if (receipt.contractAddress && receipt.status === 1) {
      console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
      console.log("📍 Contract Address:", receipt.contractAddress);
      console.log("🔗 Explorer: https://primordial.bdagscan.com/address/" + receipt.contractAddress);
      
      // Test contract
      console.log("\n🔍 Testing deployed contract...");
      const CardSmart = await ethers.getContractFactory("CardSmart");
      const cardSmart = CardSmart.attach(receipt.contractAddress);
      
      try {
        const owner = await cardSmart.owner();
        console.log("👤 Contract Owner:", owner);
        console.log("✅ Contract is working!");
        
        console.log("\n📋 Environment Variables:");
        console.log("CARDSMART_CONTRACT_ADDRESS=" + receipt.contractAddress);
        console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + receipt.contractAddress);
        
      } catch (error) {
        console.log("⚠️  Contract test failed:", error.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking deployment:", error.message);
  }
}

checkDeployment();
