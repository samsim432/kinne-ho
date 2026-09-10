import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { Conversation, ChatMessage, OfferStatus } from '../types/chat';
import { 
  Send, 
  Tag, 
  Check, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  MapPin, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    sellerName: 'Samir Simkhada',
    sellerAvatar: 'SS',
    sellerRating: 4.8,
    product: MOCK_PRODUCTS[0], // iPhone 13
    lastMessage: 'Counter-offer: Rs. 46,000',
    lastMessageTime: '5m ago',
    unreadCount: 1,
    activeOffer: {
      amount: 46000,
      status: 'pending',
      offeredBy: 'seller',
    },
    messages: [
      {
        id: 'm1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hello! Is the iPhone still available for pickup in Kathmandu?',
        timestamp: '11:00 AM',
      },
      {
        id: 'm2',
        senderId: 'seller',
        senderName: 'Samir Simkhada',
        text: 'Yes it is! Battery health is 87% and original box is included.',
        timestamp: '11:04 AM',
      },
      {
        id: 'm3',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Made an offer of Rs. 44,000',
        timestamp: '11:10 AM',
        isOfferCard: true,
        offerDetails: {
          amount: 44000,
          status: 'countered',
          offeredBy: 'buyer',
        },
      },
      {
        id: 'm4',
        senderId: 'seller',
        senderName: 'Samir Simkhada',
        text: 'Countered with Rs. 46,000',
        timestamp: '11:15 AM',
        isOfferCard: true,
        offerDetails: {
          amount: 46000,
          status: 'pending',
          offeredBy: 'seller',
        },
      },
    ],
  },
  {
    id: 'conv-2',
    sellerName: 'Shruti',
    sellerAvatar: 'SH',
    sellerRating: 4.9,
    product: MOCK_PRODUCTS[1], // Levi's Jacket
    lastMessage: 'Sure, Baneshwor works great.',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm10',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hi Shruti, can you do Rs. 2,800?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm11',
        senderId: 'seller',
        senderName: 'Shruti',
        text: 'Sure, Baneshwor works great.',
        timestamp: 'Yesterday',
      },
    ],
  },
];

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sellerParam = searchParams.get('seller');
  const productIdParam = searchParams.get('productId');

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (sellerParam) {
      const exists = INITIAL_CONVERSATIONS.find(
        (c) => c.sellerName.toLowerCase() === sellerParam.toLowerCase()
      );
      if (!exists) {
        const prod = MOCK_PRODUCTS.find((p) => p.id === productIdParam) || MOCK_PRODUCTS[0];
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          sellerName: sellerParam,
          sellerAvatar: sellerParam.slice(0, 2).toUpperCase(),
          sellerRating: 4.8,
          product: prod,
          lastMessage: `Started conversation for ${prod.title}`,
          lastMessageTime: 'Just now',
          unreadCount: 0,
          messages: [
            {
              id: `m-init-${Date.now()}`,
              senderId: 'buyer',
              senderName: 'You',
              text: `Hi ${sellerParam}, is "${prod.title}" still available?`,
              timestamp: 'Just now',
            },
          ],
        };
        return [newConv, ...INITIAL_CONVERSATIONS];
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (sellerParam) {
      const match = conversations.find(
        (c) => c.sellerName.toLowerCase() === sellerParam.toLowerCase()
      );
      if (match) return match.id;
    }
    return conversations[0]?.id || '';
  });

  const [inputText, setInputText] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerPriceInput, setOfferPriceInput] = useState('');

  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  useEffect(() => {
    if (sellerParam) {
      const match = conversations.find(
        (c) => c.sellerName.toLowerCase() === sellerParam.toLowerCase()
      );
      if (match) setSelectedId(match.id);
    }
  }, [sellerParam, conversations]);

  // Send regular text message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'buyer',
      senderName: 'You',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: inputText.trim(),
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
    setInputText('');
  };

  // Buyer sends a new or counter-offer
  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(offerPriceInput, 10);
    if (!amount || isNaN(amount) || !activeConv) return;

    const offerMsg: ChatMessage = {
      id: `offer-${Date.now()}`,
      senderId: 'buyer',
      senderName: 'You',
      text: `Offered Rs. ${amount.toLocaleString()}`,
      timestamp: 'Just now',
      isOfferCard: true,
      offerDetails: {
        amount,
        status: 'pending',
        offeredBy: 'buyer',
      },
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              activeOffer: { amount, status: 'pending', offeredBy: 'buyer' },
              lastMessage: `Offer: Rs. ${amount.toLocaleString()}`,
              lastMessageTime: 'Just now',
              messages: [...c.messages, offerMsg],
            }
          : c
      )
    );

    setShowOfferInput(false);
    setOfferPriceInput('');
  };

  // Handle Accept / Reject / Counter actions on offers
  const handleOfferAction = (action: 'accept' | 'decline' | 'counter') => {
    if (!activeConv || !activeConv.activeOffer) return;

    if (action === 'counter') {
      setShowOfferInput(true);
      setOfferPriceInput(String(activeConv.activeOffer.amount));
      return;
    }

    const updatedStatus: OfferStatus = action === 'accept' ? 'accepted' : 'declined';
    const statusText = action === 'accept' 
      ? `Deal accepted at Rs. ${activeConv.activeOffer.amount.toLocaleString()}! 🎉`
      : `Offer of Rs. ${activeConv.activeOffer.amount.toLocaleString()} was declined.`;

    const systemMsg: ChatMessage = {
      id: `action-${Date.now()}`,
      senderId: 'buyer',
      senderName: 'You',
      text: statusText,
      timestamp: 'Just now',
      isOfferCard: true,
      offerDetails: {
        amount: activeConv.activeOffer.amount,
        status: updatedStatus,
        offeredBy: activeConv.activeOffer.offeredBy,
      },
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              activeOffer: {
                ...c.activeOffer!,
                status: updatedStatus,
              },
              lastMessage: statusText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, systemMsg],
            }
          : c
      )
    );
  };

  if (!activeConv) return null;

  return (
    <div className="py-4 space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Messages & Negotiations</h1>
        <p className="text-xs sm:text-sm text-gray-500">Make offers, negotiate prices, and communicate with sellers.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left: Conversations List */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-gray-100 flex flex-col bg-gray-50/40">
          <div className="p-3.5 border-b border-gray-100 bg-white flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Inbox ({conversations.length})
            </span>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-3 border-[#1b7a53]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#1b7a53] font-bold flex items-center justify-center text-xs shrink-0">
                    {conv.sellerAvatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{conv.sellerName}</h4>
                      <span className="text-[10px] text-gray-400">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium truncate mt-0.5">{conv.product.title}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#1b7a53] shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Vinted-Style Chat Window */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-white">
          
          {/* Vinted Header: Anchored Item Banner */}
          <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${encodeURIComponent(activeConv.sellerName)}`} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#1b7a53] font-bold flex items-center justify-center text-xs">
                  {activeConv.sellerAvatar}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#1b7a53] transition-colors">
                    {activeConv.sellerName}
                  </h4>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activeConv.product.location}
                  </span>
                </div>
              </Link>
            </div>

            {/* Product Mini Pill with Direct "Make Offer" or "Buy" Action */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 pr-3">
              <img
                src={activeConv.product.image}
                alt={activeConv.product.title}
                className="w-9 h-9 rounded-lg object-cover"
              />
              <div className="text-left">
                <Link to={`/product/${activeConv.product.id}`} className="text-[11px] font-bold text-gray-900 hover:underline block truncate max-w-[130px]">
                  {activeConv.product.title}
                </Link>
                <span className="text-[11px] font-extrabold text-[#1b7a53]">
                  Rs. {activeConv.product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages & Inline Offer Cards */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[420px] bg-[#fbfcfb]">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === 'buyer';

              // Interactive Vinted Offer Card Inside Chat
              if (msg.isOfferCard && msg.offerDetails) {
                const isPending = msg.offerDetails.status === 'pending';
                const isAccepted = msg.offerDetails.status === 'accepted';
                const isDeclined = msg.offerDetails.status === 'declined';
                const offeredByMe = msg.offerDetails.offeredBy === 'buyer';

                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                          <Tag className="w-3.5 h-3.5 text-[#1b7a53]" />
                          <span>{offeredByMe ? 'Your Offer' : `${activeConv.sellerName}'s Offer`}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isAccepted ? 'bg-emerald-100 text-[#1b7a53]' :
                          isDeclined ? 'bg-red-100 text-red-600' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {msg.offerDetails.status}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between border-y border-gray-100 py-2">
                        <span className="text-xs text-gray-500">Offered Price</span>
                        <span className="text-xl font-extrabold text-[#1b7a53]">
                          Rs. {msg.offerDetails.amount.toLocaleString()}
                        </span>
                      </div>

                      {/* If the other person sent the pending offer, show instant Accept / Decline / Counter buttons */}
                      {isPending && !offeredByMe && (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <button
                            onClick={() => handleOfferAction('accept')}
                            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleOfferAction('counter')}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Counter</span>
                          </button>
                          <button
                            onClick={() => handleOfferAction('decline')}
                            className="bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {isAccepted && (
                        <div className="bg-emerald-50 rounded-xl p-2.5 text-center text-xs font-bold text-[#1b7a53] flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Offer Accepted · Ready for Pickup</span>
                        </div>
                      )}

                      <span className="text-[10px] text-gray-400 block text-right">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              // Standard Chat Bubble
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-[#1b7a53] text-white rounded-br-2xs shadow-2xs'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-2xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Make Offer Box Drawer */}
          {showOfferInput && (
            <form onSubmit={handleMakeOffer} className="p-3 bg-[#f0f9f5] border-t border-[#d2efe2] flex items-center gap-3 animate-in slide-in-from-bottom-2">
              <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-gray-500 mr-1.5">Rs.</span>
                <input
                  type="number"
                  placeholder="Enter your offer amount"
                  value={offerPriceInput}
                  onChange={(e) => setOfferPriceInput(e.target.value)}
                  className="w-full text-sm font-bold text-gray-900 focus:outline-none"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Send Offer
              </button>
              <button
                type="button"
                onClick={() => setShowOfferInput(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Bottom Toolbar & Chat Input */}
          <div className="p-3 border-t border-gray-100 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowOfferInput(!showOfferInput)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#1b7a53] text-[#1b7a53] hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Make an Offer</span>
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${activeConv.sellerName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
              <button
                type="submit"
                className="bg-[#1b7a53] hover:bg-[#156343] text-white p-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};