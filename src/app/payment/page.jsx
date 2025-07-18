"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import api from "../../lib/axios";

const TransactionsPage = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);

  // Dummy transaction for testing
  const testTransaction = {
    user_id: "ML51OlsMRcP9Ti2ruddkqldWbnk1",
    card_id: "gl0qbsF3Ril0GOsvtWP5",
    transaction_name: "Payment to amazon",
    status: true,
    amount: 1000,
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

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions();
    }
  }, [user?.uid]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Transactions</h2>

      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={addTransaction}
      >
        Add Test Transaction
      </button>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions?.map((txn) => (
            <li
              key={txn.id}
              className="border p-4 rounded shadow hover:bg-gray-50"
            >
              <h3 className="font-semibold">{txn.transaction_name}</h3>
              <p>Card ID: {txn.card_id}</p>
              <p>Amount: ₹{txn.amount}</p>
              <p>Status: {txn.status ? "Success" : "Failed"}</p>
              <p>Date: {new Date(txn.created_at?.seconds * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionsPage;
