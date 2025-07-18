// components/navbar.jsx
import React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Bell, 
  Settings,
  X,
  LogOut,
  User
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import { signOut, auth } from '../../../lib/firebase';


const Navbar = ({ activeTab, onTabChange, isMobile, isOpen, onClose }) => {
  const navItems = [
    { id: 'cards', label: 'My Cards', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
    const { user, logout: clearUser } = useAuthStore();
    const router = useRouter();

console.log("User in Navbar:", user);
  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    // Close mobile menu when item is selected
    if (isMobile && onClose) {
      onClose();
    }
  };
  const handleLogout = async () => {
    try {
      // Show loading state (optional)
      console.log("Logging out...");
      
      // Sign out from Firebase (if using Google login)
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      // Clear user from store
      clearUser();
      
      // Redirect to login page
      router.push('/login');
      
      // Close mobile menu if open
      if (isMobile && onClose) {
        onClose();
      }
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if Firebase signOut fails, clear the local state
      clearUser();
      router.push('/login');
    }
  };

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
    // Close mobile menu if open
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-102'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* User Profile Section - Fixed at Bottom */}
       <div className="flex-shrink-0 p-4 border-t border-gray-800 space-y-3">
        {/* User Profile Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
            {user?.photoURL ? (
              <img
                src={user?.photoURL}
                alt="User profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                <span className="text-md mt-1 font-medium text-white">
                  {user?.displayName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        {/* Profile Button */}
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 cursor-pointer group hover:transform hover:scale-105"
        >
          <User className="h-5 w-5 group-hover:text-white" />
          <span className="truncate">Profile</span>
        </button>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 bg-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 cursor-pointer group hover:transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <LogOut className="h-5 w-5 group-hover:text-white" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;