import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  UserCheck, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('New Baneshwor, Kathmandu (Near Chowk)');
  const [userWalletBalance] = useState(65000); // Demo balance
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = fulfillmentType === 'delivery' ? 180 : 0;
  const totalAmount = product.price + deliveryFee;
  const isBalanceSufficient = userWalletBalance >= totalAmount;

  const handleConfirmPurchase = () => {
    if (!isBalanceSufficient) {
      alert('Insufficient wallet balance. Please load your wallet via eSewa or Khalti.');
      navigate('/wallet');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // Save order mock to localStorage or state
      const orderId = `order-${Date.now()}`;
      navigate(`/order/${orderId}?productId=${product.id}&fulfillment=${fulfillmentType}&fee=${deliveryFee}`);
    }, 1200);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Secure Escrow Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Your payment is held in Kinne Ho? Escrow until you receive and approve the item.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Options & Address */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Fulfillment Method Selection */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900">1. Choose How to Get Your Item</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Pickup Option */}
              <div
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#1b7a53] bg-[#1b7a53]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1b7a53] flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1b7a53] bg-[#1b7a53]/10 px-2 py-0.5 rounded-full">
                    Free (Rs. 0)
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Self Pickup</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Meet seller at {product.location}. Verify with your 6-digit Handshake PIN.
                  </p>
                </div>
              </div>

              {/* Delivery Option */}
              <div
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#1b7a53] bg-[#1b7a53]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                    + Rs. 180
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Doorstep Delivery</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Shipped by seller or courier. 48-hour inspection protection included.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Address (Only if Delivery selected) */}
          {fulfillmentType === 'delivery' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1b7a53]" />
                  <span>Delivery Address</span>
                </h3>
              </div>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                placeholder="Enter complete street, area, house number"
                required
              />
            </div>
          )}

          {/* 3. Escrow Security Notice */}
          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1b7a53] shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 space-y-0.5 leading-relaxed">
              <span className="font-bold text-gray-900 block">Kinne Ho? Buyer Protection Active</span>
              <p>
                The seller does <strong>NOT</strong> receive your money right now. The funds are locked in Escrow. Once you physically inspect the item, you confirm and release the funds.
              </p>
            </div>
          </div>

        </div>

        {/* Right: Order Summary & Wallet Payment */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>

            {/* Product Item Pill */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{product.title}</h4>
                <p className="text-[11px] text-gray-400">Seller: {product.sellerName}</p>
                <span className="text-xs font-extrabold text-[#1b7a53]">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span className="font-semibold text-gray-900">Rs. {product.price.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-[#1b7a53]' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE (Pickup)' : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Escrow Protection Fee</span>
                <span className="font-semibold text-[#1b7a53]">FREE</span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total Escrow Hold</span>
                <span className="text-lg font-extrabold text-[#1b7a53]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Wallet Balance Status */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-gray-500" />
                <span>Your Wallet Balance:</span>
              </div>
              <span className="font-bold text-gray-900">Rs. {userWalletBalance.toLocaleString()}</span>
            </div>

            {!isBalanceSufficient && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Insufficient balance. Load wallet via eSewa or Khalti.</span>
              </div>
            )}

            {/* Confirm & Hold Button */}
            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing || !isBalanceSufficient}
              className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Locking in Escrow...' : `Pay Rs. ${totalAmount.toLocaleString()} to Escrow`}</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};