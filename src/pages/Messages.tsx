import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Tag, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag,
  ArrowRight,
  Search
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  text: string;
  time: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected';
}

interface ConversationThread {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  location: string;
  otherUser: {
    name: string;
    avatar: string;
    isVerified: boolean;
    role: 'seller' | 'buyer';
  };
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  acceptedOfferAmount?: number;
}

const INITIAL_THREADS: ConversationThread[] = [
  {
    id: 'thread-1',
    productId: '1',
    productTitle: 'iPhone 13 128GB Midnight Black',
    productPrice: 48000,
    productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    location: 'Kathmandu',
    otherUser: {
      name: 'Samir Simkhada',
      avatar: 'SS',
      isVerified: true,
      role: 'seller',
    },
    lastMessage: 'Offer Sent: Rs. 44,000',
    lastTime: '11:01 AM',
    unreadCount: 1,
    messages: [
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
    ],
  },
  {
    id: 'thread-2',
    productId: '3',
    productTitle: 'PlayStation 5 Disc Edition + 2 Controllers',
    productPrice: 58000,
    productImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=300&q=80',
    location: 'Pokhara',
    otherUser: {
      name: 'Pooja Sharma',
      avatar: 'PS',
      isVerified: true,
      role: 'seller',
    },
    lastMessage: 'Deal agreed at Rs. 54,000!',
    lastTime: 'Yesterday',
    unreadCount: 0,
    acceptedOfferAmount: 54000,
    messages: [
      {
        id: 'm20',
        sender: 'buyer',
        text: 'Will you take Rs. 54,000 if I arrange doorstep delivery via Pathao?',
        time: 'Yesterday 4:10 PM',
      },
      {
        id: 'm21',
        sender: 'seller',
        text: 'Yes, that works for me. Please proceed with escrow checkout.',
        time: 'Yesterday 4:15 PM',
      },
      {
        id: 'm22',
        sender: 'system',
        text: 'Offer Accepted! Agreed Price: Rs. 54,000. Ready for secure Escrow payment.',
        time: 'Yesterday 4:15 PM',
      },
    ],
  },
  {
    id: 'thread-3',
    productId: '2',
    productTitle: 'Nike Air Max 270 Black',
    productPrice: 4500,
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
    location: 'Lalitpur',
    otherUser: {
      name: 'Aayush Maharjan',
      avatar: 'AM',
      isVerified: false,
      role: 'seller',
    },
    lastMessage: 'Is the box and extra laces included?',
    lastTime: 'Sep 08',
    unreadCount: 0,
    messages: [
      {
        id: 'm30',
        sender: 'buyer',
        text: 'Hello! Is the box and extra laces included with the shoes?',
        time: 'Sep 08, 10:14 AM',
      },
      {
        id: 'm31',
        sender: 'seller',
        text: 'Yes, original Nike box and authentic tag are included.',
        time: 'Sep 08, 10:20 AM',
      },
    ],
  },
];

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlProductId = searchParams.get('productId');
  const [threads, setThreads] = useState<ConversationThread[]>(INITIAL_THREADS);
  
  // Find initial active thread
  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (urlProductId) {
      const match = INITIAL_THREADS.find((t) => t.productId === urlProductId);
      if (match) return match.id;
    }
    return INITIAL_THREADS[0].id;
  });

  const [inboxSearch, setInboxSearch] = useState('');
  const [inputMsg, setInputMsg] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter((t) =>
    t.productTitle.toLowerCase().includes(inboxSearch.toLowerCase()) ||
    t.otherUser.name.toLowerCase().includes(inboxSearch.toLowerCase())
  );

  // Seller Action: Accept Offer
  const handleAcceptOffer = (offerAmt: number) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        const updatedMsgs = t.messages.map((m) =>
          m.isOffer ? { ...m, offerStatus: 'accepted' as const } : m
        );
        return {
          ...t,
          acceptedOfferAmount: offerAmt,
          lastMessage: `Accepted: Rs. ${offerAmt.toLocaleString()}`,
          messages: [
            ...updatedMsgs,
            {
              id: `sys-${Date.now()}`,
              sender: 'system',
              text: `Offer Accepted! Agreed Price: Rs. ${offerAmt.toLocaleString()}. Ready for secure Escrow payment.`,
              time: 'Just now',
            },
          ],
        };
      })
    );
  };

  // Seller Action: Reject Offer
  const handleRejectOffer = () => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        const updatedMsgs = t.messages.map((m) =>
          m.isOffer ? { ...m, offerStatus: 'rejected' as const } : m
        );
        return {
          ...t,
          lastMessage: 'Offer Declined',
          messages: [
            ...updatedMsgs,
            {
              id: `sys-${Date.now()}`,
              sender: 'system',
              text: 'Offer was declined. You can send a new counter-offer.',
              time: 'Just now',
            },
          ],
        };
      })
    );
  };

  // Send standard text message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        return {
          ...t,
          lastMessage: inputMsg,
          lastTime: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'buyer',
              text: inputMsg,
              time: 'Just now',
            },
          ],
        };
      })
    );
    setInputMsg('');
  };

  // Buyer sends a new Offer
  const handleSendNewOffer = (amt: number) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        return {
          ...t,
          lastMessage: `Offer Sent: Rs. ${amt.toLocaleString()}`,
          lastTime: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `off-${Date.now()}`,
              sender: 'buyer',
              text: `New offer submitted: Rs. ${amt.toLocaleString()}`,
              time: 'Just now',
              isOffer: true,
              offerAmount: amt,
              offerStatus: 'pending',
            },
          ],
        };
      })
    );
  };

  // Helper for quick offers based on current active item's price
  const quickOfferSuggestions = [
    Math.round(activeThread.productPrice * 0.85),
    Math.round(activeThread.productPrice * 0.90),
    Math.round(activeThread.productPrice * 0.95),
  ];

  return (
    <div className="py-4 max-w-6xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="bg-white border border-gray-200 rounded-3xl flex-1 flex flex-col md:flex-row overflow-hidden shadow-card">
        
        {/* Left: Chat & Deals List */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-gray-900">Inbox & Deals</h2>
              <span className="text-[10px] font-bold text-[#1b7a53] bg-[#1b7a53]/10 px-2 py-0.5 rounded-full">
                {threads.length} Deals
              </span>
            </div>

            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {filteredThreads.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeThread.id === t.id
                    ? 'bg-white border-[#1b7a53] shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-white/80'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={t.productImage} alt={t.productTitle} className="w-11 h-11 rounded-xl object-cover" />
                  {t.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1b7a53] rounded-full border-2 border-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{t.otherUser.name}</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">{t.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-gray-700 font-semibold truncate">{t.productTitle}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{t.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Anchored Item Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3 min-w-0">
              <img src={activeThread.productImage} alt={activeThread.productTitle} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{activeThread.productTitle}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-gray-900">Listed: Rs. {activeThread.productPrice.toLocaleString()}</span>
                  <span>•</span>
                  <span className="text-gray-500">{activeThread.location}</span>
                </div>
              </div>
            </div>

            {/* Direct Pay Action Button */}
            {activeThread.acceptedOfferAmount && (
              <button
                onClick={() => navigate(`/checkout/${activeThread.productId}?agreedPrice=${activeThread.acceptedOfferAmount}`)}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 animate-pulse"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pay Rs. {activeThread.acceptedOfferAmount.toLocaleString()} to Escrow</span>
              </button>
            )}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/30">
            {activeThread.messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'buyer' ? 'items-end' : m.sender === 'seller' ? 'items-start' : 'items-center'}`}>
                
                {/* System Message */}
                {m.sender === 'system' && (
                  <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl px-4 py-2.5 text-center text-xs text-[#1b7a53] font-bold max-w-md shadow-2xs space-y-1.5">
                    <p>{m.text}</p>
                    {activeThread.acceptedOfferAmount && (
                      <button
                        onClick={() => navigate(`/checkout/${activeThread.productId}?agreedPrice=${activeThread.acceptedOfferAmount}`)}
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
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Original: Rs. {activeThread.productPrice.toLocaleString()}
                      </p>
                    </div>

                    {/* Seller Action Controls */}
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
            {quickOfferSuggestions.map((amt) => (
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
              placeholder={`Type message to ${activeThread.otherUser.name}...`}
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