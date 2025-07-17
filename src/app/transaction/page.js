"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTransaction } from '@/hooks/useTransaction';
import Notification from '../components/Notification';

export default function TransactionPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isPaying, setIsPaying] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: '', message: '' });
    const { sendTransaction, transactionStatus } = useTransaction();

    useEffect(() => {
        if (timeLeft > 0 && !isPaying) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            router.push('/dashboard');
        }
    }, [timeLeft, isPaying, router]);

    const handleCompletePayment = async () => {
        setIsPaying(true);
        try {
            const result = await sendTransaction();
            
            setNotification({
                isOpen: true,
                type: result.success ? 'success' : 'error',
                message: result.success 
                    ? `Transaction successful! Hash: ${result.hash.slice(0, 10)}...` 
                    : result.error
            });

            if (result.success) {
                // Redirect after 3 seconds on success
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            } else {
                setIsPaying(false);
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            setNotification({
                isOpen: true,
                type: 'error',
                message: error.message || 'Transaction failed. Please try again.'
            });
            setIsPaying(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
                    <div className="text-gray-600">
                        Time Remaining: 
                        <span className={`ml-2 font-mono text-xl ${timeLeft < 60 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-medium">$50.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Processing Fee:</span>
                                <span className="font-medium">$1.50</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>$51.50</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCompletePayment}
                        disabled={isPaying}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                            isPaying 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isPaying ? 'Processing...' : 'Complete Payment'}
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel Payment
                    </button>
                </div>

                {isPaying && (
                    <div className="mt-4 text-center text-green-600">
                        {transactionStatus?.hash ? 
                            <div>
                                <p>Transaction Hash:</p>
                                <p className="font-mono text-sm break-all">{transactionStatus.hash}</p>
                            </div>
                            : 'Processing payment...'
                        }
                    </div>
                )}
            </div>
            <Notification
                isOpen={notification.isOpen}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
