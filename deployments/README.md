# Deployment Tracker

This file tracks all contract deployments for the CardSmart project.

## Deployment History

### BlockDAG Primordial Testnet

| Date | Contract | Address | Tx Hash | Status |
|------|----------|---------|---------|--------|
| TBD  | CardSmart | TBD     | TBD     | Pending |

## Post-Deployment Checklist

### After Successful Deployment:
- [ ] Update `.env` file with contract address
- [ ] Update frontend Web3 configuration
- [ ] Verify contract on block explorer  
- [ ] Test contract functions
- [ ] Update README with addresses
- [ ] Submit to hackathon with contract details

### Verification Steps:
1. Run verification script: `npm run verify:blockdag`
2. Check contract on BlockDAG explorer
3. Test read functions from frontend
4. Test write functions with MetaMask
5. Confirm event emissions

## Contract Interaction Examples

### Using Hardhat Console
```javascript
const CardSmart = await ethers.getContractFactory("CardSmart");
const cardSmart = CardSmart.attach("CONTRACT_ADDRESS");

// Check owner
await cardSmart.owner();

// Register user
await cardSmart.registerUser("USER_ADDRESS");

// Create card
await cardSmart.createCard("4111111111111111", "Test Card", "Credit", ethers.utils.parseEther("5"));
```

### Using Frontend Web3
```javascript
import web3Service from './src/lib/web3.js';

// Connect wallet
await web3Service.connectWallet();

// Create card
await web3Service.createCard("4111111111111111", "My Card", "Credit", "5000");
```
