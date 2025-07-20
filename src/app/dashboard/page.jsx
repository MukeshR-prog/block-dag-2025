"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";
import Navbar from './components/navbar';
import CardManager from './pages/CardManager';
import Button from './components/Button';
import { getTokenBalance, sendToken, BDAG_TOKEN_ADDRESS } from '../../lib/ethereum';
const Page = () => {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cards');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // --- BDAG Token Balance and Send UI ---
  const [bdagBalance, setBdagBalance] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (user?.walletAddress) {
          const balance = await getTokenBalance(user.walletAddress);
          setBdagBalance(balance);
        }
      } catch (err) {
        setBdagBalance('Error');
      }
    };
    // TODO: Update with the correct wallet address property if needed
    if (user?.walletAddress) fetchBalance();
  }, [user?.walletAddress]);

  const handleSendToken = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setTxStatus('');
    try {
      const txHash = await sendToken(sendTo, sendAmount);
      setTxStatus(`Sent! Tx Hash: ${txHash}`);
      setSendTo('');
      setSendAmount('');
    } catch (err) {
      setTxStatus(err.message || 'Send failed');
    }
    setIsSending(false);
  };

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

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar (should be on top) */}
      <div className="lg:hidden z-50">
        <Navbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Overlay (below the sidebar) */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-30">
        <Navbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isMobile={false}
          isOpen={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10">
        {renderContent()}
      </div>
    </div>
  );

};

export default Page;
