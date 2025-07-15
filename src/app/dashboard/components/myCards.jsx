// components/myCards.jsx
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const MyCards = ({ 
  type,
  name,
  number,
  balance,
  limit,
  expires,
  lastUsed,
  icon: Icon,
  bgColor = 'bg-blue-600',
  textColor = 'text-white',
  onDetailsClick,
  onMenuClick
}) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{type} •••• {number}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onMenuClick}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-3">
      <div>
        <p className="text-xs text-gray-500">Balance</p>
        <p className="font-semibold text-gray-900">${balance}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Limit</p>
        <p className="font-semibold text-gray-900">${limit}</p>
      </div>
    </div>
    
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>Expires: {expires}</span>
      <Button variant="ghost" size="sm" onClick={onDetailsClick}>
        Details
      </Button>
    </div>
    
    {lastUsed && (
      <p className="text-xs text-gray-500 mt-2">Last used: {lastUsed}</p>
    )}
  </Card>
);

export default MyCards;