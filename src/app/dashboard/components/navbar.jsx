// components/navbar.jsx
import React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Bell, 
  Settings,
  X
} from 'lucide-react';

const Navbar = ({ activeTab, onTabChange, isMobile, isOpen, onClose }) => {
  const navItems = [
    { id: 'cards', label: 'My Cards', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    // Close mobile menu when item is selected
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Desktop and Mobile Sidebar (same design, different positioning)
  return (
    <div className={`bg-gray-900 text-white h-screen flex flex-col ${
      isMobile 
        ? `fixed inset-y-0 left-0 z-50 w-64 ${!isOpen ? '-translate-x-full' : ''} transition-transform duration-300 ease-in-out` 
        : 'w-64 sticky top-0'
    }`}>
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold">CardSmart</h1>
          </div>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Navigation Section - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* User Profile Section - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium">AM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Alex Morgan</p>
            <p className="text-xs text-gray-400 truncate">alex.morgan@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;