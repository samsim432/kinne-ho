import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { 
  Send, 
  Tag, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  text: string;
  time: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'countered';
}

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get('productId') || '1';
  const sellerNameParam = searchParams.get('seller') || 'Samir Simkhada';
  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'buyer',
      text: 'Hi! Is this still available? Can you do Rs. 44,000 for quick pickup in Kathmandu?',
      time: '11:00 AM',
    },
    {
      id: 'm2',
      sender: 'buyer',
      text: 'Offer Sent',
      time: '11:01 AM',
      isOffer: true,
      offerAmount: 44000,
      offerStatus: 'pending',
    },
  ]);

  const [acceptedOfferAmount, setAcceptedOfferAmount] = useState<number | null>(null);

  // Seller Action: Accept Offer
  const handleAcceptOffer = (offerAmt: number) => {
    setMessages((prev) => [
      ...prev.map((m) => m.isOffer ? { ...m, offerStatus: 'accepted' as const } : m),
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Offer Accepted! Agreed Price: Rs. ${offerAmt.toLocaleString()}. Ready for secure Escrow payment.`,
        time: 'Just now',
      },
    ]);
    setAcceptedOfferAmount(offerAmt);
  };

  // Seller Action: Reject Offer
  const handleRejectOffer = () => {
    setMessages((prev) => [
      ...prev.map((m) => m.isOffer ? { ...m, offerStatus: 'rejected' as const } : m),
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: 'Offer was declined. You can send a new counter-offer.',
        time: 'Just now',
      },
    ]);
  };

  // Send standard text message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'buyer',
        text: inputMsg,
        time: 'Just now',
      },
    ]);
    setInputMsg('');
  };

  // Buyer sends a new Offer
  const handleSendNewOffer = (amt: number) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `off-${Date.now()}`,
        sender: 'buyer',
        text: `New offer submitted: Rs. ${amt.toLocaleString()}`,
        time: 'Just now',
        isOffer: true,
        offerAmount: amt,
        offerStatus: 'pending',
      },
    ]);
  };

  return (
    <div className="py-4 max-w-6xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="bg-white border border-gray-200 rounded-3xl flex-1 flex flex-col sm:flex-row overflow-hidden shadow-card">
        
        {/* Left: Chat List */}
        <div className="w-full sm:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-extrabold text-gray-900">Inbox & Deals</h2>
            <p className="text-[11px] text-gray-500">Live negotiation threads</p>
          </div>

          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs cursor-pointer flex items-center gap-3">
              <img src={product.image} alt={product.title} className="w-11 h-11 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{sellerNameParam}</h4>
                  <span className="text-[10px] text-gray-400">11:01 AM</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">{product.title}</p>
                <span className="text-[10px] font-bold text-[#1b7a53]">Active Negotiation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Anchored Item Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <img src={product.image} alt={product.title} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-gray-900">Listed: Rs. {product.price.toLocaleString()}</span>
                  <span>•</span>
                  <span className="text-gray-500">{product.location}</span>
                </div>
              </div>
            </div>

            {/* Direct Pay Action if offer is accepted */}
            {acceptedOfferAmount && (
              <button
                onClick={() => navigate(`/checkout/${product.id}?agreedPrice=${acceptedOfferAmount}`)}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pay Rs. {acceptedOfferAmount.toLocaleString()} to Escrow</span>
              </button>
            )}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/30">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'buyer' ? 'items-end' : m.sender === 'seller' ? 'items-start' : 'items-center'}`}>
                
                {/* System Message */}
                {m.sender === 'system' && (
                  <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl px-4 py-2 text-center text-xs text-[#1b7a53] font-bold max-w-md shadow-2xs space-y-1">
                    <p>{m.text}</p>
                    {acceptedOfferAmount && (
                      <button
                        onClick={() => navigate(`/checkout/${product.id}?agreedPrice=${acceptedOfferAmount}`)}
                        className="bg-[#1b7a53] hover:bg-[#156343] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Offer Card Message */}
                {m.isOffer && (
                  <div className="bg-white border-2 border-[#1b7a53] rounded-2xl p-4 max-w-sm w-full shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-[#1b7a53]" />
                        Offer Proposal
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.offerStatus === 'accepted' ? 'bg-emerald-100 text-[#1b7a53]' :
                        m.offerStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {m.offerStatus?.toUpperCase()}
                      </span>
                    </div>

                    <div className="bg-[#f0f9f5] rounded-xl p-3 text-center">
                      <span className="text-2xl font-extrabold text-gray-900">
                        Rs. {m.offerAmount?.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-0.5">Original: Rs. {product.price.toLocaleString()}</p>
                    </div>

                    {/* Seller Controls for Offer */}
                    {m.offerStatus === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleAcceptOffer(m.offerAmount!)}
                          className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={handleRejectOffer}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-red-600 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Normal Text Bubble */}
                {!m.isOffer && m.sender !== 'system' && (
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm ${
                    m.sender === 'buyer'
                      ? 'bg-[#1b7a53] text-white rounded-br-xs'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-xs shadow-2xs'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[9px] block mt-1 ${m.sender === 'buyer' ? 'text-emerald-100 text-right' : 'text-gray-400'}`}>
                      {m.time}
                    </span>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Quick Counter Offer Pills */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-gray-500 shrink-0">Quick Offer:</span>
            {[45000, 46000, 47000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleSendNewOffer(amt)}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#1b7a53] hover:text-[#1b7a53] transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                Rs. {amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type message to Samir..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            />
            <button
              type="submit"
              className="bg-[#1b7a53] hover:bg-[#156343] text-white p-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};