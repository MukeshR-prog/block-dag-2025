// pages/dashboard.jsx
'use client'
import React, { useState } from 'react';

// Import components
import Navbar from './components/navbar';
import CardManager from './pages/CardManager';
import Button from './components/Button';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('cards');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'cards':
        return <CardManager onMobileSidebarOpen={() => setIsMobileSidebarOpen(true)} />;
      case 'transactions':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Transactions</h1>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-gray-500">Transactions content coming soon...</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Analytics</h1>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-gray-500">Analytics content coming soon...</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Notifications</h1>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-gray-500">Notifications content coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Settings</h1>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-gray-500">Settings content coming soon...</p>
            </div>
          </div>
        );
      default:
        return <CardManager onMobileSidebarOpen={() => setIsMobileSidebarOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Navbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isMobile={false}
          isOpen={true}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Navbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;