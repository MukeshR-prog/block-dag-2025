# Escrow Smart Contract for BlockDAG Hackathon

This directory contains a Solidity escrow contract for BDAG payments, supporting:

- Buyer deposits BDAG to contract
- Seller receives funds after buyer confirms delivery
- Dispute resolution by an arbiter

## How to Deploy and Use

### 1. Compile the Contract

If using Foundry:

```sh
forge build
```

If using Hardhat:

```sh
npx hardhat compile
```

### 2. Deploy the Contract

You can deploy using Foundry, Hardhat, or Remix. Example Hardhat script:

```js
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const seller = "<SELLER_ADDRESS>";
  const arbiter = "<ARBITER_ADDRESS>";
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(seller, arbiter, {
    value: hre.ethers.utils.parseEther("1.0"),
  });
  await escrow.deployed();
  console.log("Escrow deployed to:", escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 3. Interact from Frontend (MetaMask)

- Use ethers.js or web3.js to call contract methods:
  - `deposit()` (if not funded at deploy)
  - `confirmDelivery()` (buyer)
  - `raiseDispute()` (buyer or seller)
  - `resolveDispute()` (arbiter)

Example (ethers.js):

```js
const escrow = new ethers.Contract(escrowAddress, escrowAbi, signer);
await escrow.confirmDelivery();
```

### 4. Integrate with Transaction Page

- On payment, deploy or fund the escrow contract from User A (buyer)
- Show contract status and allow buyer/seller/arbiter to interact as needed

---

For more, see `Escrow.sol` and your Hardhat/Foundry docs.
