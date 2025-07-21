const ethers = require("ethers");

// Generate new wallets
const sellerWallet = ethers.Wallet.createRandom();
const arbiterWallet = ethers.Wallet.createRandom();

console.log("Seller Wallet:");
console.log("Address:", sellerWallet.address);
console.log("Private Key:", sellerWallet.privateKey);
console.log("\nArbiter Wallet:");
console.log("Address:", arbiterWallet.address);
console.log("Private Key:", arbiterWallet.privateKey);
