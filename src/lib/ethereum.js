import { ethers } from 'ethers';

export const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        return accounts[0] || null;
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        return null;
    }
};

export const sendTransaction = async (recipientAddress, amount) => {
    try {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Convert amount from ETH to Wei
        const amountInWei = ethers.parseEther(amount);

        const tx = await signer.sendTransaction({
            to: recipientAddress,
            value: amountInWei,
        });

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return {
            success: true,
            hash: receipt?.hash,
        };
    } catch (error) {
        console.error('Error sending transaction:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

// --- BDAG Token (ERC-20) Integration ---
// TODO: Replace with the actual BDAG token contract address and ABI from BlockDAG docs or your deployment
export const BDAG_TOKEN_ADDRESS = '0xYourBDAGTokenAddressHere'; // <-- Update this
export const BDAG_TOKEN_ABI = [
    // Minimal ABI for ERC-20 balanceOf, transfer, decimals, symbol
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

export const getTokenBalance = async (walletAddress) => {
    if (!window.ethereum) throw new Error('MetaMask is not installed');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(BDAG_TOKEN_ADDRESS, BDAG_TOKEN_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
};

export const sendToken = async (recipient, amount) => {
    if (!window.ethereum) throw new Error('MetaMask is not installed');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(BDAG_TOKEN_ADDRESS, BDAG_TOKEN_ABI, signer);
    const decimals = await contract.decimals();
    const amountInWei = ethers.parseUnits(amount, decimals);
    const tx = await contract.transfer(recipient, amountInWei);
    await tx.wait();
    return tx.hash;
};
