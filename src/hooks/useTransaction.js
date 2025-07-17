"use client"
import { useState } from 'react';

export function useTransaction() {
    const [transactionStatus, setTransactionStatus] = useState(null);

    const sendTransaction = async () => {
        try {
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('Please install MetaMask to make transactions');
            }

            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Create transaction parameters
            const transactionParameters = {
                to: '0x123...', // Replace with your recipient address
                from: accounts[0],
                value: '0x' + (0.01 * 1e18).toString(16), // 0.01 ETH in wei
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
