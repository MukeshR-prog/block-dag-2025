"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Coffee,
  ShoppingCart,
  Heart,
  Car,
  Smartphone,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CardDisplay from "../components/CardDisplay";
import QuickActions from "../components/QuickActions";
import UsageOverview from "../components/UsageOverView";
import RecentTransactions from "../components/RecentTransactions";
import SecurityPrivacy from "../components/SecurityPrivacy";
import SmartSuggestions from "../components/SmartSuggestionsSection";
import api from "../../../lib/axios";

const CardDetailsPage = () => {
  const [cardInfo, setCardInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transformedTransactions, setTransformedTransactions] = useState([]);
  const router = useRouter();
  const params = useParams();
  const cardId = params["card-detail"];

  // Transform transaction data to match component expectations
  const transformTransactionData = (rawTransactions) => {
    return rawTransactions.map((transaction, index) => {
      // Determine icon and color based on transaction name or category
      const getTransactionIcon = (name, category) => {
        const lowerName = name.toLowerCase();
        const lowerCategory = category?.toLowerCase() || '';
        
        if (lowerName.includes('coffee') || lowerName.includes('starbucks') || lowerCategory.includes('restaurant')) {
          return { icon: Coffee, color: 'text-green-600' };
        } else if (lowerName.includes('amazon') || lowerName.includes('shop') || lowerCategory.includes('shopping')) {
          return { icon: ShoppingCart, color: 'text-blue-600' };
        } else if (lowerName.includes('gas') || lowerName.includes('fuel') || lowerCategory.includes('gas')) {
          return { icon: Car, color: 'text-yellow-600' };
        } else if (lowerName.includes('netflix') || lowerName.includes('streaming') || lowerCategory.includes('subscription')) {
          return { icon: Smartphone, color: 'text-purple-600' };
        } else if (lowerName.includes('restaurant') || lowerName.includes('food') || lowerCategory.includes('food')) {
          return { icon: Heart, color: 'text-red-600' };
        } else if (lowerName.includes('payment') || lowerName.includes('college') || lowerName.includes('tuition')) {
          return { icon: CreditCard, color: 'text-blue-600' };
        } else {
          return { icon: DollarSign, color: 'text-gray-600' };
        }
      };

      const iconInfo = getTransactionIcon(transaction.transaction_name, transaction.category);
      
      // Format transaction date
      let dateText = 'Unknown';
      if (transaction.created_at?.seconds) {
        const transactionDate = new Date(transaction.created_at.seconds * 1000);
        const now = new Date();
        const diffDays = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) dateText = 'Today';
        else if (diffDays === 1) dateText = 'Yesterday';
        else if (diffDays < 7) dateText = `${diffDays} days ago`;
        else dateText = transactionDate.toLocaleDateString();
      }

      return {
        id: transaction.transaction_id || transaction.id || index,
        merchant: transaction.transaction_name,
        date: dateText,
        amount: `$${Math.abs(transaction.amount).toLocaleString()}`,
        status: transaction.status ? 'Completed' : 'Pending',
        icon: iconInfo.icon,
        color: iconInfo.color,
        type: transaction.transaction_type || 'debit',
        category: transaction.category || 'other'
      };
    });
  };

  useEffect(() => {
    if (!cardId) return;

    const fetchCardData = async () => {
      try {
        const res = await api.get(`/card-details/by-id?card_id=${cardId}`);
        setCardInfo(res.data);
      } catch (err) {
        console.error("Error fetching card data:", err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/transactions?card_id=${cardId}`);
        console.log("Transactions fetched:", res.data);
        setTransactions(res.data);
        
        // Transform the transactions for the component
        const transformed = transformTransactionData(res.data);
        setTransformedTransactions(transformed);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchCardData();
    fetchTransactions();
  }, [cardId]);

  if (!cardInfo) return <div className="p-6">Loading...</div>;
  
  const lastUsed = cardInfo.lastUsageTime?.toDate?.() ?? null;
  const expiryDate = cardInfo.expiryDate?.toDate?.() ?? null;

  // Generate smart suggestions based on real data
  const generateSmartSuggestions = () => {
    const suggestions = [];
    
    // Transaction pattern suggestion
    if (transactions.length > 0) {
      const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      suggestions.push({
        id: 1,
        type: 'spending',
        title: 'Transaction History Available',
        description: `You have ${transactions.length} transactions totaling $${totalAmount.toLocaleString()}. Review your spending patterns.`,
        action: 'View Spending Analysis'
      });
    }

    // Location-based suggestion
    if (cardInfo.location_track && cardInfo.location?.length > 0) {
      suggestions.push({
        id: 2,
        type: 'location',
        title: 'Location Services Enabled',
        description: `Your card works in ${cardInfo.location.join(', ')}. Use it for location-based rewards!`,
        action: 'View Nearby Offers'
      });
    }

    // Balance suggestion
    if (cardInfo.balance > 1000) {
      suggestions.push({
        id: 3,
        type: 'investment',
        title: 'High Balance Detected',
        description: `Consider optimizing your balance of $${cardInfo.balance.toLocaleString()} for better returns.`,
        action: 'Explore Options'
      });
    }

    return suggestions.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Cards
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {cardInfo.card_name || "Card Details"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Pin to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Card Display and Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <CardDisplay cardData={cardInfo} />
            <QuickActions />
          </div>

          {/* Right Column - Details and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <UsageOverview
              data={{
                lastUsed: lastUsed ? lastUsed.toLocaleString() : "N/A",
                location: cardInfo.location?.[0] || "Unknown",
                thisWeek: {
                  times: cardInfo.card_usage_count || 0,
                  amount: `$${cardInfo.balance?.toLocaleString() || '0'}`,
                },
                mostUsedAt: transactions.length > 0 ? "Recent Activity" : "No Activity",
                transactionPercentage: `${transactions.length} transactions`,
              }}
            />

            <RecentTransactions transactions={transformedTransactions} />
            <SecurityPrivacy />
            <SmartSuggestions suggestions={generateSmartSuggestions()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
