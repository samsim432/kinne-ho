import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ArrowLeft, 
  Send, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  Lock,
  Tag
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  time: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'countered';
}

interface ConversationItem {
  id: string;
  user: string;
  avatar: string;
  item: string;
  productId: string;
  price: number;
  lastMessage: string;
  time: string;
  unread?: number;
  location: string;
}

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useMarketplace();

  const sellerParam = searchParams.get('seller');
  const productIdParam = searchParams.get('productId');
  const offerParam = searchParams.get('offer');

  const [conversations] = useState<ConversationItem[]>([
    {
      id: 'c1',
      user: 'Samir Simkhada',
      avatar: 'SS',
      item: 'iPhone 13 128GB',
      productId: '1',
      price: 48000,
      lastMessage: 'Offer: Rs. 46,000',
      time: '2 hr ago',
      unread: 2,
      location: 'Kathmandu',
    },
    {
      id: 'c2',
      user: 'Shruti Maharjan',
      avatar: 'SM',
      item: "Levi's Denim Jacket",
      productId: '2',
      price: 3200,
      lastMessage: 'Is this still available?',
      time: '22 hr ago',
      location: 'Lalitpur',
    },
    {
      id: 'c3',
      user: 'Bibek Thapa',
      avatar: 'BT',
      item: 'PS5 DualSense Controller',
      productId: '3',
      price: 9500,
      lastMessage: 'Can you meet at Pokhara Lakeside?',
      time: '1 day ago',
      location: 'Pokhara',
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return sellerParam ? 'c1' : null;
  });

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'buyer',
      text: 'Hello! Is this item still available for handover?',
      time: 'Yesterday',
    },
    {
      id: '2',
      sender: 'seller',
      text: 'Yes, it is in excellent condition and ready for inspection.',
      time: 'Yesterday',
    },
    {
      id: '3',
      sender: 'buyer',
      text: 'Proposed an offer',
      time: '10m ago',
      isOffer: true,
      offerAmount: offerParam ? parseInt(offerParam, 10) : 46000,
      offerStatus: 'pending',
    },
  ]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'buyer',
        text: inputMsg.trim(),
        time: 'Just now',
      },
    ]);
    setInputMsg('');
  };

  const handleAcceptOffer = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, offerStatus: 'accepted' as const } : m))
    );
    showToast('Offer Accepted! 🤝', 'Buyer can now proceed to escrow checkout at this agreed price.', 'success');
  };

  const handleRejectOffer = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, offerStatus: 'rejected' as const } : m))
    );
    showToast('Offer Rejected', 'You rejected the proposed offer.', 'info');
  };

  return (
    <div className="py-2 max-w-4xl mx-auto space-y-4">
      
      {!activeConvId ? (
        /* Conversation Inbox List */
        <div className="space-y-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Messages & Offers</h1>

          <div className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-2xs divide-y divide-gray-100">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className="p-4 flex items-center gap-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b7a53] font-black flex items-center justify-center text-sm shrink-0">
                  {c.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{c.user}</h3>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-semibold truncate">{c.item} · Rs. {c.price.toLocaleString()}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                </div>

                {c.unread && (
                  <span className="w-5 h-5 rounded-full bg-[#1b7a53] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Chat & Negotiation Stream */
        <div className="space-y-3">
          <div className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-card flex flex-col h-[78vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1b7a53] font-bold text-xs flex items-center justify-center">
                  {activeConv?.avatar || 'SS'}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">{activeConv?.user || sellerParam || 'Seller'}</h3>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {activeConv?.location || 'Kathmandu'} • Listing: {activeConv?.item || 'Item'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/checkout/${activeConv?.productId || productIdParam || '1'}`)}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Buy with Escrow</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/40">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'buyer' ? 'items-end' : 'items-start'}`}>
                  
                  {m.isOffer ? (
                    /* Structured Negotiation Offer Card */
                    <div className="bg-white border-2 border-emerald-200 rounded-3xl p-5 max-w-sm w-full shadow-md space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-[#1b7a53]" />
                          Price Offer Proposal
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          m.offerStatus === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.offerStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.offerStatus?.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-2xl font-black text-gray-900">
                          Rs. {m.offerAmount?.toLocaleString()}
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Buyer offered to purchase with protected escrow lock.
                        </p>
                      </div>

                      {/* Offer Action Buttons */}
                      {m.offerStatus === 'pending' && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleAcceptOffer(m.id)}
                            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleRejectOffer(m.id)}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {/* If Accepted, One-Click Escrow Checkout */}
                      {m.offerStatus === 'accepted' && (
                        <button
                          onClick={() => navigate(`/checkout/${activeConv?.productId || productIdParam || '1'}`)}
                          className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Lock Agred Price into Escrow</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Standard Message Bubble */
                    <div className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm ${
                      m.sender === 'buyer'
                        ? 'bg-[#1b7a53] text-white rounded-br-xs'
                        : 'bg-white border border-gray-200/90 text-gray-900 rounded-bl-xs shadow-2xs'
                    }`}>
                      <p className="leading-relaxed">{m.text}</p>
                      <span className={`text-[9px] block mt-1 ${m.sender === 'buyer' ? 'text-emerald-100 text-right' : 'text-gray-400'}`}>
                        {m.time}
                      </span>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a message or negotiate handover time..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#1b7a53] text-white hover:bg-[#156343] transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};