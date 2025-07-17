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
