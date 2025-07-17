// src/app/dashboard/pages/CardDetailsPage.jsx
"use client"
import React, { useState } from 'react';
import { ArrowLeft, Eye, Lock, Settings, CreditCard, DollarSign, ShoppingCart, Smartphone, Car, Coffee, Heart } from 'lucide-react';
import CardDisplay from '../components/CardDisplay';
import QuickActions from '../components/QuickActions';
import UsageOverview from '../components/UsageOverView';
import RecentTransactions from '../components/RecentTransactions';
import SecurityPrivacy from '../components/SecurityPrivacy';
import SmartSuggestions from '../components/SmartSuggestionsSection';
import { useParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import Link from 'next/link';

const CardDetailsPage = ({ cardData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const params = useParams();
  const cardId = params['card-detail'];
  const router = useRouter();

  const handlePaymentClick = () => {
    try {
      router.push('/transaction');
      console.log('Navigating to transaction page from card details');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  // Sample card data - in real app, this would come from props or API
  const defaultCardData = {
    id: '4567',
    type: 'Chase Sapphire Preferred',
    lastFour: '4567',
    cardHolder: 'John Smith',
    status: 'Active',
    balance: '$245.78',
    availableCredit: '$9,000.00',
    paymentDue: 'Jul 23',
    usageOverview: {
      lastUsed: 'Today, 2:45 PM',
      location: 'Starbucks Seattle',
      thisWeek: {
        times: 15,
        amount: '$28.67'
      },
      mostUsedAt: 'Grocery Stores',
      transactionPercentage: '43% of transactions'
    },
    recentTransactions: [
      {
        id: 1,
        merchant: 'Starbucks',
        date: 'Today, 2:45 PM',
        amount: '$5.75',
        status: 'Completed',
        icon: Coffee,
        color: 'text-green-600'
      },
      {
        id: 2,
        merchant: 'Amazon.com',
        date: 'Yesterday, 10:30 PM',
        amount: '$34.99',
        status: 'Completed',
        icon: ShoppingCart,
        color: 'text-blue-600'
      },
      {
        id: 3,
        merchant: 'Chipotle',
        date: 'Jul 14, 3:25 PM',
        amount: '$12.48',
        status: 'Completed',
        icon: Heart,
        color: 'text-red-600'
      },
      {
        id: 4,
        merchant: 'Shell Gas Station',
        date: 'Jul 13, 7:20 AM',
        amount: '$45.23',
        status: 'Completed',
        icon: Car,
        color: 'text-yellow-600'
      },
      {
        id: 5,
        merchant: 'Netflix',
        date: 'Jul 5, 10:00 AM',
        amount: '$14.99',
        status: 'Completed',
        icon: Smartphone,
        color: 'text-purple-600'
      }
    ],
    smartSuggestions: [
      {
        id: 1,
        type: 'restaurant',
        title: 'You often use this card at restaurants',
        description: 'Set as your default dining card to earn 2x points on all restaurant purchases',
        action: 'Set as Default for Dining'
      },
      {
        id: 2,
        type: 'recurring',
        title: 'Recurring payment detected',
        description: 'We detected a monthly payment of $14.99 to Netflix. Would you like to set up auto-pay?',
        action: 'Set up Automatic Payment'
      },
      {
        id: 3,
        type: 'spending',
        title: 'Spending insights available',
        description: 'We\'ve analyzed your spending patterns for the last 3 months.',
        action: 'View Insights'
      }
    ]
  };

  const cardInfo = cardData || defaultCardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={()=>(router.push('/dashboard'))}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Cards
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {cardInfo.type}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/transaction"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Make Payment
              </Link>
              <button 
                onClick={handlePaymentClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Make Payment (Alt)
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
            <UsageOverview data={cardInfo.usageOverview} />
            <RecentTransactions transactions={cardInfo.recentTransactions} />
            <SecurityPrivacy />
            <SmartSuggestions suggestions={cardInfo.smartSuggestions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;