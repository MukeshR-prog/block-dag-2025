"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import api from "../../lib/axios";
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { type } from "os";

const Page = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txError, setTxError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setNetworkError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to make transactions");
      }

      // First check if we're on Sepolia
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        setNetworkError("Please switch to Sepolia Test Network in MetaMask before connecting");
        return;
      }

      // If we're on Sepolia, request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error("Connection error:", error);
      setNetworkError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Dummy transaction for testing
  const testTransaction = {
    user_id: "IeRHUaPaS6dLMVpNfqtE32qJIpS2",
    card_id: "ZZIHqZDiOa7ChFoUJwMO",
    transaction_name: "Flipkart gift received",
    status: true,
    type:"credit",
    amount: 2000,
  };

  const addTransaction = async () => {
    try {
      const res = await api.post("/transactions", testTransaction);
      if (res.data.success) {
        alert("Transaction added successfully");
        fetchTransactions();
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log("Fetching transactions for user:", user?.uid);
      
      const res = await api.get(`/transactions?user_id=${user?.uid}`);
      setTransactions(res?.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const sendEthTransaction = async () => {
    setTxError(null);
    setTxHash(null);
    if (!ethers.utils.isAddress(toAddress)) {
      setTxError("Invalid recipient address");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setTxError("Invalid amount");
      return;
    }
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(amount)
      });
      setTxHash(tx.hash);
    } catch (err) {
      setTxError(err.message);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions();
    }
  }, [user?.uid]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment Transaction</h2>

      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Wallet Connection</h3>
          {!walletAddress ? (
            <div>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connecting...
                  </>
                ) : (
                  "Connect MetaMask"
                )}
              </button>
              {networkError && (
                <p className="mt-2 text-red-600 text-sm">{networkError}</p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">
                Connected Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          )}
        </div>

        <button
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          onClick={addTransaction}
          disabled={!walletAddress}
        >
          {!walletAddress ? "Connect wallet to transact" : "Process Transaction"}
        </button>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Send ETH Transaction</h3>
          <input
            type="text"
            placeholder="Recipient address (0x...)"
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={sendEthTransaction}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mt-2"
            disabled={!walletAddress}
          >
            Send ETH
          </button>
          {txError && <p className="text-red-600 mt-2">{txError}</p>}
          {txHash && <p className="text-green-600 mt-2">Tx Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash}</a></p>}
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions?.map((txn) => (
            <li
              key={txn.id}
              className="border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <h3 className="font-semibold">{txn.transaction_name}</h3>
              <p className="text-sm text-gray-600">Card ID: {txn.card_id}</p>
              <p className="text-sm text-gray-600">Amount: ₹{txn.amount}</p>
              <p className="text-sm">
                Status: 
                <span className={txn.status ? "text-green-600" : "text-red-600"}>
                  {txn.status ? " Success" : " Failed"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(txn.created_at?.seconds * 1000).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
