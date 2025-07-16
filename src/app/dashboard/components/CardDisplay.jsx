// src/app/dashboard/components/CardDisplay.jsx
import React from 'react';
import { CreditCard } from 'lucide-react';

const CardDisplay = ({ cardData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Credit Card Visual */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-xs opacity-75 mb-1">Credit Card</div>
              <div className="text-sm font-medium">{cardData.type}</div>
            </div>
            <div className="bg-white bg-opacity-20 p-1 rounded">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs opacity-75 mb-1">Card Number</div>
            <div className="text-lg font-mono tracking-wider">
              •••• •••• •••• {cardData.lastFour}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75 mb-1">Valid Thru</div>
              <div className="text-sm">08/28</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75 mb-1">CVV</div>
              <div className="text-sm">•••</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <div className="text-sm font-medium">{cardData.cardHolder}</div>
          </div>
        </div>
      </div>

      {/* Quick Info Below Card */}
      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <div className="text-xs text-gray-500">Status</div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Payment Due</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">{cardData.paymentDue}</div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;