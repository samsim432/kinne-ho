import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { initiateEsewaPayment } from '../lib/esewa';
import { DeliveryMapPicker } from '../components/checkout/DeliveryMapPicker';
import { KhaltiModal } from '../components/checkout/KhaltiModal';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  UserCheck, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Wallet,
  Loader2
} from 'lucide-react';
import type { ProductItem } from '../types/marketplace';

export const Checkout: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { createEscrowOrder, showToast } = useMarketplace();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState<'self_pickup' | 'doorstep'>('doorstep');
  const [address, setAddress] = useState(profile?.delivery_address || 'New Baneshwor, Kathmandu');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'wallet'>('esewa');
  const [isKhaltiModalOpen, setIsKhaltiModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);

      try {
        const { data: dbItem, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', productId)
          .maybeSingle();

        if (!error && dbItem) {
          setProduct({
            id: dbItem.id,
            title: dbItem.title,
            price: Number(dbItem.price),
            originalPrice: dbItem.original_price ? Number(dbItem.original_price) : undefined,
            condition: dbItem.condition,
            category: dbItem.category_id,
            location: dbItem.location,
            sellerName: 'Verified Seller',
            sellerRating: 4.9,
            image: dbItem.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
            timeAgo: 'Recently',
            isVerified: true,
          });
        } else {
          const fallback = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
          setProduct(fallback);
        }
      } catch {
        setProduct(MOCK_PRODUCTS[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#1b7a53] animate-spin" />
        <p className="text-xs font-bold text-gray-500">Preparing secure checkout escrow...</p>
      </div>
    );
  }

  if (!product) return null;

  const deliveryFee = deliveryMethod === 'doorstep' ? 180 : 0;
  const totalAmount = product.price + deliveryFee;

  const handlePayAndLockEscrow = async () => {
    if (!user) {
      showToast('Sign in required', 'Please sign in to proceed with secure escrow payment.', 'warning');
      navigate('/auth');
      return;
    }

    if (paymentMethod === 'khalti') {
      setIsKhaltiModalOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'esewa') {
        const txUuid = `KH-${Date.now()}`;
        const newOrder = createEscrowOrder({
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          productImage: product.image,
          sellerName: product.sellerName,
          buyerName: profile ? `${profile.first_name} ${profile.surname}`.trim() : 'Buyer',
          deliveryMethod,
          deliveryFee,
          totalAmount,
          address,
          paymentGateway: 'esewa',
        });

        initiateEsewaPayment({
          amount: product.price,
          deliveryCharge: deliveryFee,
          transactionUuid: txUuid,
          productCode: 'EPAYTEST',
          successUrl: `${window.location.origin}/order/${newOrder.id}`,
          failureUrl: `${window.location.origin}/checkout/${product.id}?status=failed`,
        });
        return;
      }

      // Wallet payment flow
      const newOrder = createEscrowOrder({
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.image,
        sellerName: product.sellerName,
        buyerName: profile ? `${profile.first_name} ${profile.surname}`.trim() : 'Buyer',
        deliveryMethod,
        deliveryFee,
        totalAmount,
        address,
        paymentGateway: 'wallet',
      });

      showToast('Escrow Locked! 🔒', 'Your funds are held safely until handover verification.', 'success');
      navigate(`/order/${newOrder.id}`);
    } catch (err: any) {
      showToast('Payment Failed', err.message || 'Could not process transaction', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKhaltiSuccess = (txId: string) => {
    setIsKhaltiModalOpen(false);
    const newOrder = createEscrowOrder({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.image,
      sellerName: product.sellerName,
      buyerName: profile ? `${profile.first_name} ${profile.surname}`.trim() : 'Buyer',
      deliveryMethod,
      deliveryFee,
      totalAmount,
      address,
      paymentGateway: 'khalti',
    });

    showToast('Khalti Escrow Locked! 🟣', 'Payment held in escrow. Handshake PIN created.', 'success');
    navigate(`/order/${newOrder.id}`);
  };

  return (
    <div className="py-4 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Secure Escrow Checkout
          </h1>
          <p className="text-xs text-gray-500">
            Guaranteed protection. Funds are held in Kinne Ho? Escrow until inspection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Delivery & Payment Options */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Fulfillment */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              1. Delivery or Pickup Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('self_pickup')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'self_pickup'
                    ? 'border-[#1b7a53] bg-emerald-50/50 ring-1 ring-[#1b7a53]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <UserCheck className="w-5 h-5 text-[#1b7a53]" />
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-[#1b7a53] px-2 py-0.5 rounded-md">
                    FREE (Rs. 0)
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 mt-2">Self Pickup</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Meet seller locally with Handshake PIN.</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('doorstep')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'doorstep'
                    ? 'border-[#1b7a53] bg-emerald-50/50 ring-1 ring-[#1b7a53]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck className="w-5 h-5 text-[#1b7a53]" />
                  <span className="text-[10px] font-extrabold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                    + Rs. 180
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 mt-2">Doorstep Delivery</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Delivered with 48h inspection safety.</p>
              </button>
            </div>
          </div>

          {/* Address & GPS Pinning */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              2. Delivery Address & Map Pin
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Street / Chowk / Area Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. New Baneshwor, Kathmandu"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-xs font-bold text-gray-700 block">Pin Point on Map</span>
              <DeliveryMapPicker />
            </div>
          </div>

          {/* Gateways: eSewa, Khalti & Wallet */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              3. Select Payment Gateway
            </h3>

            <div className="space-y-2">
              {/* eSewa */}
              <div
                onClick={() => setPaymentMethod('esewa')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'esewa'
                    ? 'border-[#60bb46] bg-emerald-50/40 ring-1 ring-[#60bb46]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#60bb46]/20 text-[#60bb46] font-extrabold flex items-center justify-center text-xs">
                    eS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">eSewa EPAY v2 (Sandbox)</h4>
                    <p className="text-[10px] text-gray-500">Pay directly via official eSewa Nepal portal</p>
                  </div>
                </div>
                {paymentMethod === 'esewa' && <CheckCircle2 className="w-4 h-4 text-[#60bb46]" />}
              </div>

              {/* Khalti */}
              <div
                onClick={() => setPaymentMethod('khalti')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'khalti'
                    ? 'border-[#5C2D91] bg-purple-50/40 ring-1 ring-[#5C2D91]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#5C2D91]/20 text-[#5C2D91] font-extrabold flex items-center justify-center text-xs">
                    K
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Khalti EPAY (Sandbox)</h4>
                    <p className="text-[10px] text-gray-500">Fast in-app OTP checkout via Khalti</p>
                  </div>
                </div>
                {paymentMethod === 'khalti' && <CheckCircle2 className="w-4 h-4 text-[#5C2D91]" />}
              </div>

              {/* Wallet */}
              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-[#1b7a53] bg-emerald-50/40 ring-1 ring-[#1b7a53]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Kinne Ho? Wallet Balance</h4>
                    <p className="text-[10px] text-gray-500">Available: Rs. {Number(profile?.wallet_balance || 50000).toLocaleString()}</p>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <CheckCircle2 className="w-4 h-4 text-[#1b7a53]" />}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-2xs space-y-4 sticky top-20">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Payment Breakdown
            </h3>

            <div className="flex gap-3 pb-3 border-b border-gray-100">
              <img src={product.image} alt={product.title} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{product.title}</h4>
                <p className="text-[10px] text-gray-400">Seller: {product.sellerName}</p>
                <p className="text-xs font-extrabold text-[#1b7a53] mt-0.5">
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span className="font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Escrow Handover Protection</span>
                <span>FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-900">Total Escrow Lock</span>
              <span className="text-xl font-extrabold text-[#1b7a53]">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayAndLockEscrow}
              className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-extrabold py-3 rounded-2xl transition-all shadow-md cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Locking Escrow Funds...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay Rs. {totalAmount.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Khalti Sandbox In-App Modal */}
      <KhaltiModal
        isOpen={isKhaltiModalOpen}
        onClose={() => setIsKhaltiModalOpen(false)}
        amountInRs={totalAmount}
        productTitle={product.title}
        onSuccess={handleKhaltiSuccess}
      />

    </div>
  );
};