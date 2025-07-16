// components/CardManager.jsx
'use client'
import React, { useState } from 'react';
import { 
  CreditCard, 
  Bell, 
  Search, 
  Filter, 
  Plus,
  MapPin,
  Star,
  Zap,
  Gift
} from 'lucide-react';
import { useRouter } from "next/navigation";
// Import components
import Card from '../components/Card';
import MyCards from '../components/myCards';
import SingleCardDetails from '../components/singleCardDetails';
import SmartSuggestions from '../components/SmartSuggestions';
import Button from '../components/Button';
import useAuthStore from '../../../store/authStore';

const CardManager = ({ onMobileSidebarOpen }) => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Cards');

  const smartSuggestions = [
    {
      id: 1,
      icon: CreditCard,
      title: 'Chase Sapphire',
      subtitle: 'Visa •••• 4528',
      badge: 'Used Today',
      badgeVariant: 'info',
      actionText: 'Last used: 2 hours ago',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id:2,
      icon: Star,
      title: 'Starbucks Rewards',
      subtitle: 'Loyalty Card',
      badge: 'Nearby',
      badgeVariant: 'success',
      actionText: 'Starbucks 0.2 miles away',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id:3,
      icon: CreditCard,
      title: 'Metro Card',
      subtitle: 'Transit Pass',
      badge: 'Most Used',
      badgeVariant: 'purple',
      actionText: 'Used 24 times this month',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const creditCards = [
    {
      type: 'Visa',
      name: 'Chase Sapphire',
      number: '4528',
      balance: '2,458.50',
      limit: '10,000.00',
      expires: '06/25',
      icon: CreditCard,
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      type: 'Mastercard',
      name: 'Citi Premier',
      number: '7623',
      balance: '1,275.30',
      limit: '8,000.00',
      expires: '11/24',
      icon: CreditCard,
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    }
  ];

  const loyaltyCards = [
    {
      name: 'Starbucks Rewards',
      type: 'Loyalty Card',
      points: '235',
      nextReward: '15 points away',
      lastUsed: '2 days ago',
      icon: Star,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      name: 'Metro Card',
      type: 'Transit Pass',
      balance: '42.75',
      status: 'Auto-reload Enabled',
      lastUsed: 'Today',
      icon: CreditCard,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const cryptoCards = [
    {
      name: 'Coinbase Card',
      type: 'Crypto Visa',
      balance: '1,245.80',
      points: '0.025 BTC',
      lastUsed: '5 days ago',
      icon: Zap,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const giftCards = [
    {
      name: 'Amazon Gift Card',
      type: 'Gift Card',
      balance: '50.00',
      expires: 'Never',
      lastUsed: 'Added: Jul 12, 2023',
      icon: Gift,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  ];

  const membershipCards = [
    {
      name: 'Fitness Club',
      type: 'Membership Card',
      status: 'Active',
      nextReward: 'Aug 15, 2023',
      lastUsed: '3 days ago',
      icon: Zap,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

    const router = useRouter();

    const handleCardClick = (cardData) => {
      console.log("Card clicked:", cardData);
      router.push(`/dashboard/${cardData.id}`); // assuming cardData has an `id` field
    };


      
    

  const handleMenuClick = (cardData) => {
    console.log('Menu clicked:', cardData);
  };

  const handleDetailsClick = (cardData) => {
    console.log('Details clicked:', cardData);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMobileSidebarOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Cards</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
              {user?.photoURL ? (
                <img
                  src={user?.photoURL}
                  alt="User profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">?</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Location Banner */}
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <MapPin className="h-4 w-4" />
          <span>Location services are enabled for smart card suggestions</span>
          <Button variant="ghost" size="sm" className="ml-auto text-blue-600">
            Manage
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 lg:p-6">
        {/* Smart Suggestions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Smart Suggestions</h2>
            <Button variant="ghost" size="sm">
              Customize
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartSuggestions.map((suggestion, index) => (
              <SmartSuggestions 
                key={index} 
                {...suggestion} 
                onAction={() => handleCardClick(suggestion)}
              />
            ))}
          </div>
        </div>

        {/* All Cards Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">All Cards</h2>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cards"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              
              <Button variant="outline" size="sm">
                Recent
              </Button>
            </div>
          </div>

          {/* Card Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All Cards', 'Payment', 'Loyalty', 'Travel', 'Crypto', 'Gift Cards'].map(category => (
              <Button
                key={category}
                variant={filterType === category ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilterType(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Credit Cards */}
            {(filterType === 'All Cards' || filterType === 'Payment') && 
              creditCards.map((card, index) => (
                <MyCards 
                  key={`credit-${index}`} 
                  {...card} 
                  onDetailsClick={() => handleDetailsClick(card)}
                  onMenuClick={() => handleMenuClick(card)}
                />
              ))
            }
            {/* Loyalty Cards */}
            {(filterType === 'All Cards' || filterType === 'Loyalty') && 
              loyaltyCards.map((card, index) => (
                <SingleCardDetails 
                  key={`loyalty-${index}`} 
                  {...card} 
                  onDetailsClick={() => handleDetailsClick(card)}
                  onMenuClick={() => handleMenuClick(card)}
                />
              ))
            }

            {/* Crypto Cards */}
            {(filterType === 'All Cards' || filterType === 'Crypto') && 
              cryptoCards.map((card, index) => (
                <SingleCardDetails 
                  key={`crypto-${index}`} 
                  {...card} 
                  onDetailsClick={() => handleDetailsClick(card)}
                  onMenuClick={() => handleMenuClick(card)}
                />
              ))
            }

            {/* Gift Cards */}
            {(filterType === 'All Cards' || filterType === 'Gift Cards') && 
              giftCards.map((card, index) => (
                <SingleCardDetails 
                  key={`gift-${index}`} 
                  {...card} 
                  onDetailsClick={() => handleDetailsClick(card)}
                  onMenuClick={() => handleMenuClick(card)}
                />
              ))
            }

            {/* Membership Cards */}
            {(filterType === 'All Cards' || filterType === 'Travel') && 
              membershipCards.map((card, index) => (
                <SingleCardDetails 
                  key={`membership-${index}`} 
                  {...card} 
                  onDetailsClick={() => handleDetailsClick(card)}
                  onMenuClick={() => handleMenuClick(card)}
                />
              ))
            }

            {/* Add New Card */}
            <Card className="p-6 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Add New Card</h3>
              <p className="text-sm text-gray-600 text-center">Connect a payment or loyalty card</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CardManager;