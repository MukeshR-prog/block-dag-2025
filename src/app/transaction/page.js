"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransaction } from '@/hooks/useTransaction';
import useAuthStore from '../../store/authStore'; // ✅ Import auth store
import api from '../../lib/axios'; // ✅ Import API
import Notification from '../components/Notification';

export default function TransactionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore(); // ✅ Get user from auth store
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isPaying, setIsPaying] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: '', message: '' });
    const [mmStatus, setMmStatus] = useState("");
    const [mmError, setMmError] = useState("");
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    
    // ✅ Get card_id from URL params with better error handling
    const card_id = searchParams.get('card_id');
    
    // ✅ Transaction details state
    const [transactionDescription, setTransactionDescription] = useState("");
    const [transactionAddress, setTransactionAddress] = useState("");
    
    // ✅ Validate required data
    useEffect(() => {
        if (!user) {
            console.warn("No user found in auth store");
        }
        if (!card_id) {
            console.warn("No card_id found in URL parameters");
        }
        console.log("Transaction page initialized:", { user: user?.uid, card_id });
    }, [user, card_id]);
    // Handler to add BlockDAG Primordial Testnet to MetaMask
    const handleAddBlockDAGNetwork = async () => {
        setMmStatus("");
        setMmError("");
        if (!window.ethereum) {
            setMmError("MetaMask is not installed.");
            return;
        }
        try {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "1043", // 1043 in hex
                        chainName: "Primordial BlockDAG Testnet",
                        rpcUrls: ["https://rpc.primordial.bdagscan.com"],
                        nativeCurrency: {
                            name: "BDAG",
                            symbol: "BDAG",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://primordial.bdagscan.com/"],
                    },
                ],
            });
            setMmStatus("BlockDAG Testnet added to MetaMask!");
        } catch (err) {
            setMmError(err.message || "Failed to add network.");
        }
    };

    // ✅ Function to save transaction to backend
    const saveTransactionToBackend = async (txHash, sender) => {
        try {
            // ✅ Validate required data before sending
            if (!user?.uid) {
                throw new Error("User ID not found. Please log in again.");
            }
            if (!card_id) {
                throw new Error("Card ID not found. Please select a card.");
            }

            const transactionData = {
                user_id: user.uid,
                card_id: card_id,
                transaction_name: `BlockDAG Transfer to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
                description: transactionDescription || `Blockchain transfer of ${amount} BDAG`,
                address: transactionAddress || recipient, // Use transaction address or recipient as fallback
                status: true,
                type: "debit", // Sending money is a debit
                amount: Number(amount),
                blockchain_hash: txHash,
                recipient_address: recipient,
                network: "BlockDAG Primordial Testnet"
            };

            console.log("Sending transaction data to backend:", transactionData);

            const res = await api.post("/transactions", transactionData);
            if (res.data.success) {
                console.log("Transaction saved to backend successfully:", res.data.transaction);
                setNotification({
                    isOpen: true,
                    type: 'success',
                    message: 'Transaction saved to your account!'
                });
            }
        } catch (err) {
            console.error("Error saving transaction to backend:", err);
            setNotification({
                isOpen: true,
                type: 'error',
                message: `Backend save failed: ${err.message}`
            });
            // Don't fail the main transaction if backend save fails
        }
    };

    // (removed duplicate declaration)



    useEffect(() => {
        if (timeLeft > 0 && !isPaying) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            router.push('/dashboard');
        }
    }, [timeLeft, isPaying, router]);

    // Use MetaMask to send transaction from one account to another
    const handleCompletePayment = async () => {
        setIsPaying(true);
        setTransactionStatus(null);
        setNotification({ isOpen: false, type: '', message: '' });
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is required to send transactions.');
            }
            if (!recipient || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                setNotification({ isOpen: true, type: 'error', message: 'Please enter a valid recipient address and amount.' });
                setIsPaying(false);
                return;
            }
            if (!user?.uid) {
                setNotification({ isOpen: true, type: 'error', message: 'Please log in to continue.' });
                setIsPaying(false);
                return;
            }
            if (!card_id) {
                setNotification({ isOpen: true, type: 'error', message: 'Card ID not found. Please go back and select a card.' });
                setIsPaying(false);
                return;
            }
            
            // Get sender address (first account in MetaMask)
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const sender = accounts[0];
            // Prepare transaction params for MetaMask
            const valueWei = '0x' + (Number(amount) * 1e18).toString(16);
            const txParams = {
                from: sender,
                to: recipient,
                value: valueWei,
                gas: '0x5208', // 21000
            };
            // Send transaction via MetaMask
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams],
            });
            
            // ✅ Save transaction to backend after blockchain success
            await saveTransactionToBackend(txHash, sender);
            
            setTransactionStatus({ success: true, hash: txHash });
            setNotification({
                isOpen: true,
                type: 'success',
                message: `Transaction successful! Hash: ${txHash.slice(0, 10)}...`
            });
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
        } catch (error) {
            setTransactionStatus({ success: false, error: error.message });
            setNotification({
                isOpen: true,
                type: 'error',
                message: error.message || 'Transaction failed. Please try again.'
            });
            setIsPaying(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center py-4 gap-2">
                <button
                    onClick={handleAddBlockDAGNetwork}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold shadow hover:scale-105 transition-transform duration-200"
                >
                    Add BlockDAG Testnet to MetaMask
                </button>
                {mmStatus && <div className="text-green-600 text-center mb-2">{mmStatus}</div>}
                {mmError && <div className="text-red-600 text-center mb-2">{mmError}</div>}
            </div>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2 text-black">Complete Your Payment</h1>
                    <div className="text-gray-800">
                        Time Remaining: 
                        <span className={`ml-2 font-mono text-xl ${timeLeft < 60 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Recipient Address</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={e => setRecipient(e.target.value)}
                            placeholder="Enter recipient address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-1">Amount (BDAG)</label>
                        <input
                            type="number"
                            min="0.000000000000000001"
                            step="any"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Enter amount to transfer"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
                        />
                    </div>
                    
                    {/* ✅ New Description Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Description (Optional)</label>
                        <textarea
                            value={transactionDescription}
                            onChange={e => setTransactionDescription(e.target.value)}
                            placeholder="Enter transaction description..."
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white resize-none"
                        />
                    </div>
                    
                    {/* ✅ New Address Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-1">Transaction Address (Optional)</label>
                        <input
                            type="text"
                            value={transactionAddress}
                            onChange={e => setTransactionAddress(e.target.value)}
                            placeholder="Enter location or address for this transaction"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
                        />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h2 className="text-lg font-semibold mb-2 text-black">Payment Details</h2>
                        <div className="space-y-2 text-black">
                            <div className="flex justify-between">
                                <span>Recipient:</span>
                                <span className="font-mono break-all text-sm">{recipient || <span className="italic text-gray-400">Not entered</span>}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-medium">{amount ? `${amount} BDAG` : <span className="italic text-gray-400">Not entered</span>}</span>
                            </div>
                            {transactionDescription && (
                                <div className="flex justify-between">
                                    <span>Description:</span>
                                    <span className="text-sm">{transactionDescription}</span>
                                </div>
                            )}
                            {transactionAddress && (
                                <div className="flex justify-between">
                                    <span>Location:</span>
                                    <span className="text-sm">{transactionAddress}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Processing Fee:</span>
                                <span className="font-medium">$1.50</span>
                            </div>
                            {user && (
                                <div className="flex justify-between">
                                    <span>User:</span>
                                    <span className="text-sm">{user.displayName || user.email}</span>
                                </div>
                            )}
                            {card_id && (
                                <div className="flex justify-between">
                                    <span>Card ID:</span>
                                    <span className="text-xs font-mono">{card_id}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleCompletePayment}
                        disabled={isPaying}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                            isPaying 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isPaying ? 'Processing...' : 'Complete Payment'}
                    </button>
                    {isPaying && !transactionStatus?.hash && (
                        <div className="text-blue-600 text-center mt-2">Processing transaction...</div>
                    )}
                    {transactionStatus?.hash && (
                        <div className="text-green-600 text-center mt-2">Transaction Successful!<br/>Hash: <span className="font-mono">{transactionStatus.hash}</span></div>
                    )}
                    {transactionStatus?.error && (
                        <div className="text-red-600 text-center mt-2">Transaction Failed or Rejected.<br/>{transactionStatus.error}</div>
                    )}

                    <button
                        onClick={() => router.back()}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel Payment
                    </button>
                </div>

                {isPaying && (
                    <div className="mt-4 text-center text-green-600">
                        {transactionStatus?.hash ? 
                            <div>
                                <p>Transaction Hash:</p>
                                <p className="font-mono text-sm break-all">{transactionStatus.hash}</p>
                            </div>
                            : 'Processing payment...'
                        }
                    </div>
                )}
            </div>
            <Notification
                isOpen={notification.isOpen}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
