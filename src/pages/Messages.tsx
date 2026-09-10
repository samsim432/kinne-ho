import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { ProductItem } from '../types/marketplace';
import { 
  Send, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  X,
  Plus
} from 'lucide-react';

interface FeedOffer {
  amount: number;
  status: 'Pending' | 'Counter offer' | 'Accepted' | 'Declined';
  senderType: 'buyer' | 'seller';
}

interface MessageItem {
  id: string;
  senderType: 'buyer' | 'seller';
  text?: string;
  timeAgo: string;
  isSafetyBanner?: boolean;
  offer?: FeedOffer;
}

interface Thread {
  id: string;
  name: string;
  initials: string;
  location: string;
  product: ProductItem;
  timeAgo: string;
  unreadCount?: number;
  offerPreviewText?: string;
  lastMessageSnippet?: string;
  messages: MessageItem[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 't1',
    name: 'Samir Simkhada',
    initials: 'SS',
    location: 'Kathmandu',
    product: MOCK_PRODUCTS[0], // iPhone 13 128GB
    timeAgo: '2 hr ago',
    unreadCount: 2,
    offerPreviewText: 'Offer: Rs. 46,000',
    messages: [
      {
        id: 'm-safety',
        senderType: 'seller',
        timeAgo: '',
        isSafetyBanner: true,
      },
      {
        id: 'm1',
        senderType: 'buyer',
        text: 'Hi Samir, is the iPhone still available?',
        timeAgo: '6 hr ago',
      },
      {
        id: 'm2',
        senderType: 'seller',
        text: 'Yes it is. Battery health is 87%, no cracks.',
        timeAgo: '5 hr ago',
      },
      {
        id: 'm3',
        senderType: 'buyer',
        text: 'Is the price negotiable?',
        timeAgo: '4 hr ago',
      },
      {
        id: 'm4',
        senderType: 'buyer',
        timeAgo: '4 hr ago',
        offer: {
          amount: 44000,
          status: 'Counter offer',
          senderType: 'buyer',
        },
      },
      {
        id: 'm5',
        senderType: 'seller',
        text: 'I can do Rs. 46,000 with the case and cable.',
        timeAgo: '2 hr ago',
      },
      {
        id: 'm6',
        senderType: 'seller',
        timeAgo: '2 hr ago',
        offer: {
          amount: 46000,
          status: 'Pending',
          senderType: 'seller',
        },
      },
    ],
  },
  {
    id: 't2',
    name: 'Shruti Maharjan',
    initials: 'SM',
    location: 'Lalitpur',
    product: MOCK_PRODUCTS[1], // Levi's Denim Jacket
    timeAgo: '22 hr ago',
    lastMessageSnippet: 'Sorry, Rs. 3,200 is the lowest I can go.',
    messages: [
      {
        id: 'sm1',
        senderType: 'buyer',
        text: 'Hi Shruti, can you do Rs. 2,800?',
        timeAgo: 'Yesterday',
      },
      {
        id: 'sm2',
        senderType: 'seller',
        text: 'Sorry, Rs. 3,200 is the lowest I can go.',
        timeAgo: '22 hr ago',
      },
    ],
  },
  {
    id: 't3',
    name: 'Bibek Thapa',
    initials: 'BT',
    location: 'Pokhara',
    product: {
      ...MOCK_PRODUCTS[3],
      title: 'PS5 DualSense Controller',
      price: 9500,
    },
    timeAgo: '1 hr ago',
    unreadCount: 1,
    lastMessageSnippet: 'Controller is still available if you are i...',
    messages: [
      {
        id: 'bt1',
        senderType: 'seller',
        text: 'Controller is still available if you are interested!',
        timeAgo: '1 hr ago',
      },
    ],
  },
  {
    id: 't4',
    name: 'Anjali Shrestha',
    initials: 'AS',
    location: 'Bhaktapur',
    product: {
      ...MOCK_PRODUCTS[5],
      title: 'Two-Seater Fabric Sofa',
      price: 18500,
    },
    timeAgo: '3 days ago',
    lastMessageSnippet: 'Accepted. I will message you the pickup ti...',
    messages: [
      {
        id: 'as1',
        senderType: 'seller',
        text: 'Accepted. I will message you the pickup time.',
        timeAgo: '3 days ago',
      },
    ],
  },
];

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sellerParam = searchParams.get('seller');
  const productIdParam = searchParams.get('productId');

  const [threads, setThreads] = useState<Thread[]>(() => {
    if (sellerParam) {
      const match = INITIAL_THREADS.find(
        (t) => t.name.toLowerCase() === sellerParam.toLowerCase()
      );
      if (!match) {
        const prod = MOCK_PRODUCTS.find((p) => p.id === productIdParam) || MOCK_PRODUCTS[0];
        const newThread: Thread = {
          id: `t-${Date.now()}`,
          name: sellerParam,
          initials: sellerParam.slice(0, 2).toUpperCase(),
          location: prod.location,
          product: prod,
          timeAgo: 'Just now',
          lastMessageSnippet: `Inquired about ${prod.title}`,
          messages: [
            {
              id: `m-safety-${Date.now()}`,
              senderType: 'seller',
              timeAgo: '',
              isSafetyBanner: true,
            },
            {
              id: `init-${Date.now()}`,
              senderType: 'buyer',
              text: `Hi ${sellerParam}, is "${prod.title}" still available?`,
              timeAgo: 'Just now',
            },
          ],
        };
        return [newThread, ...INITIAL_THREADS];
      }
    }
    return INITIAL_THREADS;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (sellerParam) {
      const match = threads.find(
        (t) => t.name.toLowerCase() === sellerParam.toLowerCase()
      );
      if (match) return match.id;
    }
    return threads[0]?.id || '';
  });

  const [inputText, setInputText] = useState('');
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');

  useEffect(() => {
    if (sellerParam) {
      const match = threads.find(
        (t) => t.name.toLowerCase() === sellerParam.toLowerCase()
      );
      if (match) setSelectedId(match.id);
    }
  }, [sellerParam, threads]);

  const activeThread = threads.find((t) => t.id === selectedId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      senderType: 'buyer',
      text: inputText.trim(),
      timeAgo: 'Just now',
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessageSnippet: inputText.trim(),
              timeAgo: 'Just now',
            }
          : t
      )
    );

    setInputText('');
  };

  const handleAcceptOffer = (amount: number) => {
    const acceptedMsg: MessageItem = {
      id: `acc-${Date.now()}`,
      senderType: 'buyer',
      text: `Accepted offer of Rs. ${amount.toLocaleString()}! Let's arrange pickup.`,
      timeAgo: 'Just now',
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              offerPreviewText: `Agreed: Rs. ${amount.toLocaleString()}`,
              messages: t.messages
                .map((m) =>
                  m.offer && m.offer.status === 'Pending'
                    ? { ...m, offer: { ...m.offer, status: 'Accepted' as const } }
                    : m
                )
                .concat(acceptedMsg),
            }
          : t
      )
    );
  };

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(counterPrice, 10);
    if (!amount || isNaN(amount)) return;

    const counterMsg: MessageItem = {
      id: `cnt-${Date.now()}`,
      senderType: 'buyer',
      timeAgo: 'Just now',
      offer: {
        amount,
        status: 'Counter offer',
        senderType: 'buyer',
      },
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              offerPreviewText: `Offer: Rs. ${amount.toLocaleString()}`,
              messages: [...t.messages, counterMsg],
            }
          : t
      )
    );

    setShowCounterInput(false);
    setCounterPrice('');
  };

  if (!activeThread) return null;

  return (
    <div className="py-2 sm:py-4 space-y-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Messages</h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] shadow-2xs">
        
        {/* Left: Sidebar Inbox */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-gray-100 flex flex-col bg-white">
          <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
            {threads.map((thread) => {
              const isSelected = thread.id === selectedId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#edf7f2] text-[#1b7a53] font-bold flex items-center justify-center text-xs shrink-0">
                    {thread.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{thread.name}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-gray-400">{thread.timeAgo}</span>
                        {thread.unreadCount && thread.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#1b7a53] text-white text-[10px] font-bold flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {thread.product.title} · Rs. {thread.product.price.toLocaleString()}
                    </p>

                    {thread.offerPreviewText ? (
                      <p className="text-[11px] text-[#1b7a53] font-medium truncate mt-0.5">
                        {thread.offerPreviewText}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {thread.lastMessageSnippet}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-[#F9FAF9]">
          
          {/* Chat Header matching Screenshot */}
          <div className="p-3.5 px-5 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#edf7f2] text-[#1b7a53] font-bold flex items-center justify-center text-xs">
                {activeThread.initials}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  {activeThread.name}
                </h4>
                <span className="text-[11px] text-gray-400">
                  {activeThread.location}
                </span>
              </div>
            </div>

            {/* Product Pill Header */}
            <Link
              to={`/product/${activeThread.product.id}`}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-lg border border-gray-200/80 bg-white hover:border-gray-300 transition-colors shadow-2xs"
            >
              <img
                src={activeThread.product.image}
                alt={activeThread.product.title}
                className="w-8 h-8 rounded-md object-cover bg-gray-900"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-gray-900 block truncate max-w-[130px]">
                  {activeThread.product.title}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  Rs. {activeThread.product.price.toLocaleString()}
                </span>
              </div>
            </Link>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[460px]">
            {activeThread.messages.map((msg) => {
              if (msg.isSafetyBanner) {
                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 max-w-sm text-xs text-gray-500 flex items-center gap-2 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Keep communication and transactions on Kinne Ho? whenever possible.</span>
                    </div>
                  </div>
                );
              }

              // Offer Cards matching Screenshot
              if (msg.offer) {
                const isBuyerOffer = msg.offer.senderType === 'buyer';
                
                if (isBuyerOffer) {
                  return (
                    <div key={msg.id} className="flex flex-col items-end">
                      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs w-48 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 font-medium">Your offer</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                            {msg.offer.status}
                          </span>
                        </div>
                        <p className="text-base font-extrabold text-gray-900">
                          Rs. {msg.offer.amount.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 mr-1">{msg.timeAgo}</span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs w-48 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">Seller's offer</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          msg.offer.status === 'Accepted'
                            ? 'bg-emerald-50 text-[#1b7a53] border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {msg.offer.status}
                        </span>
                      </div>
                      <p className="text-base font-extrabold text-gray-900">
                        Rs. {msg.offer.amount.toLocaleString()}
                      </p>

                      {msg.offer.status === 'Pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAcceptOffer(msg.offer!.amount)}
                            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold px-3 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              setShowCounterInput(true);
                              setCounterPrice(String(msg.offer!.amount - 1000));
                            }}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Counter
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 ml-1">{msg.timeAgo}</span>
                  </div>
                );
              }

              // Standard Text Bubbles
              const isBuyer = msg.senderType === 'buyer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isBuyer
                        ? 'bg-[#1b7a53] text-white shadow-2xs'
                        : 'bg-white border border-gray-200/80 text-gray-900 shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-gray-400 mt-1 ${isBuyer ? 'mr-1' : 'ml-1'}`}>
                    {msg.timeAgo}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Counter Drawer */}
          {showCounterInput && (
            <form onSubmit={handleSendCounterOffer} className="p-3 bg-white border-t border-gray-200 flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-600">Your Counter: Rs.</span>
              <input
                type="number"
                placeholder="Amount"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                className="w-36 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                autoFocus
                required
              />
              <button
                type="submit"
                className="bg-[#1b7a53] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#156343] transition-colors cursor-pointer"
              >
                Send Counter
              </button>
              <button
                type="button"
                onClick={() => setShowCounterInput(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Bottom Chat Bar matching Screenshot */}
          <div className="p-3.5 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1b7a53] focus:ring-1 focus:ring-[#1b7a53]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  inputText.trim()
                    ? 'bg-[#1b7a53] text-white'
                    : 'bg-[#98cfb7] text-white opacity-80 cursor-not-allowed'
                }`}
                title="Send message"
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