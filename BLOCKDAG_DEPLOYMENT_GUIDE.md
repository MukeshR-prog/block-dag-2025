# 🚀 BlockDAG Testnet Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Wallet Funded**: Your wallet `0xB5d8893578cA8FdabfD15a6229569f28AB5bb652` has `143.97 BDAG` - Sufficient for deployment!
✅ **Environment Configured**: `.env` file properly set up
✅ **Dependencies Installed**: All Hardhat dependencies are present
✅ **Smart Contract Ready**: CardSmart.sol is available

## 🔧 Environment Configuration

Your current `.env` configuration:
```bash
# ✅ Correct BlockDAG RPC endpoint
BLOCKDAG_TESTNET_RPC=https://rpc.primordial.bdagscan.com

# ✅ Private key with 0x prefix
PRIVATE_KEY=0x66a4e1c970576508ae7d5b50ee72c799ff93d9aed13afedfac6caf8afe1a884a

# ✅ Network Configuration
NEXT_PUBLIC_BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
NEXT_PUBLIC_CHAIN_ID=1043
```

## 🚀 Step-by-Step Deployment

### Step 1: Compile Contracts
```bash
npm run compile
```

### Step 2: Run Tests (Optional but Recommended)
```bash
npm run test
```

### Step 3: Deploy to BlockDAG Testnet
```bash
npm run deploy:blockdag
```

### Step 4: Verify Contract (Optional)
```bash
npm run verify:blockdag
```

## 🔍 Expected Deployment Output

```bash
🚀 Starting CardSmart deployment...
📝 Deploying with account: 0xB5d8893578cA8FdabfD15a6229569f28AB5bb652
💰 Account balance: 143.976899999999832
📦 Deploying CardSmart contract...
⏳ Waiting for deployment...
✅ CardSmart deployed to: 0x[CONTRACT_ADDRESS]
👤 Registering deployer as user...
✅ User registered successfully!

🎉 DEPLOYMENT SUCCESSFUL!
Contract Address: 0x[CONTRACT_ADDRESS]
```

## ⚠️ Common Issues & Solutions

### Issue 1: "insufficient funds for gas"
**Solution**: Your wallet has enough funds, but if this occurs:
- Check gas price settings in hardhat.config.js
- Increase gas limit if needed

### Issue 2: "nonce too high"
**Solution**: Reset MetaMask account or wait for network sync

### Issue 3: "network connection error"
**Solution**: 
- Verify RPC endpoint: https://rpc.primordial.bdagscan.com
- Check internet connection
- Try again after a few minutes

## 🔗 Network Information

- **Network Name**: BlockDAG Primordial Testnet
- **Chain ID**: 1043
- **RPC URL**: https://rpc.primordial.bdagscan.com
- **Explorer**: https://primordial.bdagscan.com
- **Faucet**: https://primordial.bdagscan.com/faucet

## 📝 Post-Deployment Steps

1. **Update .env file** with deployed contract address:
```bash
CARDSMART_CONTRACT_ADDRESS=[0xf86990c8644010704492c4d0208658205B1e538a
NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=0xf86990c8644010704492c4d0208658205B1e538a
```

2. **Add to MetaMask**:
- Network Name: BlockDAG Primordial
- RPC URL: https://rpc.primordial.bdagscan.com
- Chain ID: 1043
- Currency Symbol: BDAG

3. **Verify on Explorer**:
Visit: https://primordial.bdagscan.com/address/0xf86990c8644010704492c4d0208658205B1e538a

## 🎯 Ready to Deploy!

Your environment is properly configured. Run the deployment command:

```bash
npm run deploy:blockdag
```

Expected deployment time: 1-2 minutes
Estimated gas cost: ~0.01 BDAG
