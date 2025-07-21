# BlockDAG Escrow dApp — Hackathon Submission

> This project is a full-stack escrow payment platform for the BlockDAG Hackathon, featuring:

- **Next.js** frontend with MetaMask integration
- **Solidity Escrow Smart Contract** (with buyer, seller, arbiter, and dispute logic)
- **Hardhat/Foundry** for contract deployment and testing

## Features

- Native BDAG payments via MetaMask
- Escrow contract holds funds until delivery is confirmed
- Dispute resolution by an arbiter
- Clean, professional UI with clear user roles
- Full testnet-ready deployment and usage instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   cd contracts/hardhat
   npm install
   ```
2. **Compile and deploy the Escrow contract:**

   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network <your_blockdag_testnet>
   ```

   > Update `scripts/deploy.js` with your seller and arbiter addresses.

3. **Start the frontend:**

   ```bash
   cd ../..
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

4. **Test the full escrow flow:**
   - Enter recipient and amount on the transaction page
   - Deposit BDAG to the contract (buyer)
   - Confirm delivery (buyer)
   - Raise/resolve disputes (buyer/seller/arbiter)

## Demo

![UI Screenshot](./screenshot.png)

## Project Structure

- `contracts/foundry` and `contracts/hardhat`: Smart contract code and deployment scripts
- `src/app/transaction/page.js`: Main transaction UI with MetaMask integration
- `src/app/dashboard/components/EscrowActions.jsx`: Escrow contract interaction UI

## Submission Checklist

1. Escrow contract deployed to BlockDAG testnet
2. Frontend updated with deployed contract address
3. Full flow tested with MetaMask
4. README polished with overview, features, and demo
5. No unused or placeholder files in main directory

---

For contract details, see [`contracts/foundry/README.md`](contracts/foundry/README.md) and [`Escrow.sol`](contracts/foundry/src/Escrow.sol).
