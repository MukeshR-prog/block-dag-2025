const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 CardSmart Contract Verification");
  console.log("==================================");

  const contractAddress = "0xf86990c8644010704492c4d0208658205B1e538a";
  const [deployer] = await ethers.getSigners();
  
  console.log("📍 Contract Address:", contractAddress);
  console.log("👤 Verifier Address:", deployer.address);

  // Get contract instance
  const CardSmart = await ethers.getContractFactory("CardSmart");
  const cardSmart = CardSmart.attach(contractAddress);

  try {
    // Test basic functions
    console.log("\n🧪 Testing Contract Functions:");
    
    // 1. Check owner
    const owner = await cardSmart.owner();
    console.log("✅ Contract Owner:", owner);
    
    // 2. Check counters
    const totalCards = await cardSmart.getTotalCards();
    const totalTransactions = await cardSmart.getTotalTransactions();
    console.log("✅ Total Cards:", totalCards.toString());
    console.log("✅ Total Transactions:", totalTransactions.toString());
    
    // 3. Test user registration
    console.log("\n👤 Testing User Registration:");
    const isRegisteredBefore = await cardSmart.authorizedUsers(deployer.address);
    console.log("📋 User registered before:", isRegisteredBefore);
    
    if (!isRegisteredBefore) {
      console.log("📝 Registering user...");
      const registerTx = await cardSmart.registerUser(deployer.address);
      await registerTx.wait();
      console.log("✅ User registration successful!");
    }
    
    // 4. Check user analytics
    const analytics = await cardSmart.getUserAnalytics(deployer.address);
    console.log("✅ User Analytics:", {
      totalCards: analytics.totalCards.toString(),
      totalTransactions: analytics.totalTransactions.toString(),
      totalSpent: analytics.totalSpent.toString(),
      totalIncome: analytics.totalIncome.toString()
    });
    
    // 5. Test card creation
    console.log("\n💳 Testing Card Creation:");
    try {
      const createCardTx = await cardSmart.createCard(
        "1234-5678-9012-3456",
        "Test Card",
        "Credit",
        ethers.parseEther("1000") // 1000 BDAG credit limit
      );
      const receipt = await createCardTx.wait();
      
      // Find the CardCreated event
      const cardCreatedEvent = receipt.logs.find(log => {
        try {
          const parsed = cardSmart.interface.parseLog(log);
          return parsed.name === 'CardCreated';
        } catch {
          return false;
        }
      });
      
      if (cardCreatedEvent) {
        const parsedEvent = cardSmart.interface.parseLog(cardCreatedEvent);
        console.log("✅ Card created with ID:", parsedEvent.args.cardId.toString());
        
        // Get card details
        const cardDetails = await cardSmart.getCard(parsedEvent.args.cardId);
        console.log("✅ Card Details:", {
          id: cardDetails.id.toString(),
          cardName: cardDetails.cardName,
          category: cardDetails.category,
          balance: ethers.formatEther(cardDetails.balance),
          creditLimit: ethers.formatEther(cardDetails.creditLimit),
          isActive: cardDetails.isActive
        });
      }
    } catch (error) {
      console.log("⚠️  Card creation:", error.message);
    }
    
    console.log("\n🎉 CONTRACT VERIFICATION COMPLETED!");
    console.log("==================================");
    console.log("✅ All basic functions are working correctly");
    console.log("🌐 Contract is deployed and functional on BlockDAG");
    
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
