import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useMarketplace } from '../context/MarketplaceContext';
import { DeliveryMapPicker } from '../components/checkout/DeliveryMapPicker';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  UserCheck, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  KeyRound,
  Mail,
  AlertCircle,
  X
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { walletBalance, deductForEscrow, showToast } = useMarketplace();

  const agreedPriceParam = searchParams.get('agreedPrice');
  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  // Use agreed negotiated price if present, otherwise default price
  const itemPrice = agreedPriceParam ? parseInt(agreedPriceParam, 10) : product.price;

  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('New Baneshwor, Kathmandu (Near Eye Hospital)');
  const [pinnedCoordinates, setPinnedCoordinates] = useState({ lat: 27.7172, lng: 85.3240, label: 'Kathmandu' });

  // 2FA Security Email Verification Gate
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const deliveryFee = fulfillmentType === 'delivery' ? 180 : 0;
  const totalAmount = itemPrice + deliveryFee;
  const isBalanceSufficient = walletBalance >= totalAmount;

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanceSufficient) {
      showToast('Insufficient wallet balance', 'Please load funds via eSewa or Khalti.', 'error');
      navigate('/wallet');
      return;
    }
    // Open 2FA Security Email Modal
    setShowSecurityModal(true);
  };

  const handleConfirmSecurityCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingCode(true);

    setTimeout(() => {
      const success = deductForEscrow(totalAmount);
      setIsVerifyingCode(false);

      if (success) {
        setShowSecurityModal(false);
        const orderId = `order-${Date.now()}`;
        navigate(`/order/${orderId}?productId=${product.id}&fulfillment=${fulfillmentType}&fee=${deliveryFee}`);
      }
    }, 1000);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Secure Escrow Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Guaranteed protection. Funds are held safely in Kinne Ho? Escrow until inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Fulfillment, Address & Interactive Map */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Fulfillment Option */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900">1. Delivery or Pickup Method</h3>

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
                    FREE (Rs. 0)
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Self Pickup</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Meet seller at {product.location}. Handshake PIN required.
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
                    Delivered to your pinned address with 48h inspection.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Address & Interactive Map (Only if Delivery chosen) */}
          {fulfillmentType === 'delivery' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1b7a53]" />
                <span>2. Delivery Address & Map Pin</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Street / Chowk / Area Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  placeholder="e.g. House 42, New Baneshwor, Kathmandu"
                  required
                />
              </div>

              {/* Interactive OpenStreetMap Pin Selector */}
              <DeliveryMapPicker
                onSelectCoordinates={(lat, lng, label) => {
                  setPinnedCoordinates({ lat, lng, label });
                  setDeliveryAddress((prev) => `${prev.split(' (')[0]} (${label})`);
                }}
              />
            </div>
          )}

          {/* 3. Escrow Security Notice */}
          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1b7a53] shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 space-y-0.5 leading-relaxed">
              <span className="font-bold text-gray-900 block">Kinne Ho? Escrow Security Active</span>
              <p>
                Your funds are locked safely in escrow. The seller cannot withdraw until you verify the item and approve condition.
              </p>
            </div>
          </div>

        </div>

        {/* Right: Order Summary & Wallet Checkout */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900">Payment Breakdown</h3>

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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-extrabold text-[#1b7a53]">
                    Rs. {itemPrice.toLocaleString()}
                  </span>
                  {agreedPriceParam && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-bold">
                      Agreed Price
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span className="font-semibold text-gray-900">Rs. {itemPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-[#1b7a53]' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE (Pickup)' : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Escrow Protection</span>
                <span className="font-semibold text-[#1b7a53]">FREE</span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total Escrow Lock</span>
                <span className="text-lg font-extrabold text-[#1b7a53]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Wallet Balance Status */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-gray-500" />
                <span>Wallet Balance:</span>
              </div>
              <span className="font-bold text-gray-900">Rs. {walletBalance.toLocaleString()}</span>
            </div>

            {!isBalanceSufficient && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Insufficient balance. Load wallet via eSewa or Khalti.</span>
              </div>
            )}

            <button
              onClick={handleInitiatePayment}
              disabled={!isBalanceSufficient}
              className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>Authorize & Pay Rs. {totalAmount.toLocaleString()}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2FA Email Security Verification Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Email Payment Authorization</h3>
              <p className="text-xs text-gray-500">
                We sent a 6-digit confirmation code to <strong>wrongsamir88@gmail.com</strong>
              </p>
            </div>

            <form onSubmit={handleConfirmSecurityCode} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-2xl text-center text-xs text-gray-500 space-y-0.5">
                <p>Sample Demo Verification Code:</p>
                <span className="font-extrabold text-sm text-[#1b7a53] tracking-wider">829401</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block text-center uppercase tracking-wider">
                  Enter 6-Digit Email Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="829401"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center text-2xl tracking-widest font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1b7a53]"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingCode || securityCode.length < 4}
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isVerifyingCode ? 'Authorizing Payment...' : `Confirm & Lock Rs. ${totalAmount.toLocaleString()} in Escrow`}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};