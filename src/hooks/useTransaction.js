"use client"
import { useState } from 'react';

export function useTransaction() {
    const [transactionStatus, setTransactionStatus] = useState(null);

    const sendTransaction = async () => {
        try {
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('Please install MetaMask to make transactions');
            }

            // --- BlockDAG EVM Testnet network switching logic ---
            const targetNetwork = {
                chainId: '0x2B670', // 177024
                name: 'BlockDAG Primordial Testnet',
                testAddress: '0x64bbd83a12ad427fe6bd3388c2c0537887ca601d', // Your MetaMask testnet address
                rpcUrls: ['https://primordial-rpc.blockdag.network'],
                blockExplorerUrls: ['https://primordial.bdagscan.com'],
                nativeCurrency: { name: 'BDAG', symbol: 'BDAG', decimals: 18 },
            };

            // Check current network
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== targetNetwork.chainId) {
                // Try to switch network
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: targetNetwork.chainId }],
                    });
                } catch (switchError) {
                    // If the network is not added, try to add it
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: targetNetwork.chainId,
                                chainName: targetNetwork.name,
                                nativeCurrency: targetNetwork.nativeCurrency,
                                rpcUrls: targetNetwork.rpcUrls,
                                blockExplorerUrls: targetNetwork.blockExplorerUrls,
                            }],
                        });
                    } else {
                        throw new Error(`Please switch to the ${targetNetwork.name} network in MetaMask.`);
                    }
                }
            }

            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Create transaction parameters
            const transactionParameters = {
                to: targetNetwork.testAddress, // Valid BlockDAG testnet address
                from: accounts[0],
                value: '0x' + (0.01 * 1e18).toString(16), // 0.01 BDAG in wei
                gas: '0x5208', // 21000 gas
            };

            // Send transaction
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            setTransactionStatus({
                success: true,
                hash: txHash,
            });

            return {
                success: true,
                hash: txHash,
            };
        } catch (error) {
            const errorMessage = error.message || 'Transaction failed';
            setTransactionStatus({
                success: false,
                error: errorMessage,
            });

            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    return {
        sendTransaction,
        transactionStatus,
    };
}
