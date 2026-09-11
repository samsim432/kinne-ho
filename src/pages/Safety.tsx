import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  Wallet, 
  HelpCircle,
  Truck, 
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string[];
  rules?: string[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  image: string;
  articles: Article[];
}

const HELP_DATA: Topic[] = [
  {
    id: 'selling',
    title: 'Selling on Kinne Ho?',
    description: 'Learn how to list items, set fair prices, manage handovers, and receive instant payouts in Nepal.',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80',
    articles: [
      {
        id: 'list-item',
        title: 'How to list your first item with photos',
        summary: 'Upload clear photos, write honest descriptions, and select the right category.',
        content: [
          'Take at least 2–4 clear photos in natural daylight showing the front, back, and any wear or scratches.',
          'Choose the exact category (e.g. Electronics, Clothing, Gaming, Furniture, Books) so buyers can filter and find your item.',
          'Clearly describe what is included (original box, charger, bill, warranty card, etc.).'
        ],
        rules: [
          'No stock internet photos for used items — you must photograph the actual item you own.',
          'Disclose all known defects in Step 3 of the listing form to avoid buyer dispute refunds.',
          'Prohibited items: counterfeit goods, weapons, illegal substances, and replica brand items.'
        ]
      },
      {
        id: 'handshake-otp',
        title: 'Understanding Handshake OTP payment release',
        summary: 'How the 4-digit code works to protect your money during local handover.',
        content: [
          'When a buyer purchases your item, their funds are locked securely in Kinne Ho? Escrow.',
          'Meet the buyer at an agreed public chowk or landmark (e.g. New Baneshwor, Patan Durbar Square, Lakeside).',
          'Let the buyer inspect the physical item and test device functionality.',
          'Once satisfied, ask the buyer for their secret 4-digit Handshake OTP PIN.',
          'Enter the PIN on your Order page — escrow funds will instantly release to your Kinne Ho? wallet.'
        ],
        rules: [
          'Never hand over the product before verifying the buyer’s 4-digit PIN on your phone.',
          'Do not ask for advance cash transfers outside the Kinne Ho? platform.'
        ]
      },
      {
        id: 'withdraw-funds',
        title: 'Withdrawing funds to eSewa, Khalti, or Bank',
        summary: 'Fast settlement to your digital wallet or bank account in Nepal.',
        content: [
          'Once the Handshake PIN is verified, funds appear immediately in your "Available Balance".',
          'Go to your Wallet page and select your preferred payout method (eSewa ID, Khalti ID, or Nepali Bank Account).',
          'Standard digital wallet transfers process within 15–30 minutes with zero platform withdrawal fees.'
        ],
        rules: [
          'The mobile number on your eSewa/Khalti account should match your verified profile details.',
          'Minimum withdrawal amount is Rs. 100.'
        ]
      },
      {
        id: 'manage-listings',
        title: 'Managing & editing your active listings',
        summary: 'Update prices, mark items as reserved, or delete sold inventory.',
        content: [
          'Access all your published products from the "My Listings" tab.',
          'You can lower the price at any time to attract more buyer offers.',
          'If you sell the item outside the platform, delete or mark the listing as sold immediately.'
        ]
      }
    ]
  },
  {
    id: 'buying',
    title: 'Buying & Escrow Safety',
    description: 'Understand how your money is protected until you inspect the item in person.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    articles: [
      {
        id: 'escrow-protection',
        title: 'How Kinne Ho? Escrow protects your money',
        summary: 'Your payment never goes directly to the seller until you approve condition.',
        content: [
          'When you click "Buy Now" and pay via eSewa, Khalti, or Wallet, funds are held by Kinne Ho? Escrow.',
          'The seller receives a notification to prepare the item, but cannot withdraw the money.',
          'You hold the secret 4-digit Handshake PIN in your Order screen.',
          'Only after you meet the seller and verify the item matches the description do you share the PIN.'
        ],
        rules: [
          'Never share your 4-digit PIN over chat or phone call before meeting in person.',
          'If the item is broken or fake, do not share the PIN. Click "Open Dispute" for a full 100% refund.'
        ]
      },
      {
        id: 'inspecting-items',
        title: 'Inspecting devices & clothes before giving PIN',
        summary: 'Checklist for in-person handovers and physical verification.',
        content: [
          'For Electronics: Check screen touch, camera, speaker, Wi-Fi connectivity, charging port, and battery health % in settings.',
          'For Clothing: Check fabric seams, zipper functionality, stains, and true size fit.',
          'For Gaming Gear: Ensure controllers connect without joystick drift and console powers up properly.'
        ],
        rules: [
          'Take 5–10 minutes to test thoroughly at the meeting point before giving the Handshake PIN.'
        ]
      },
      {
        id: 'making-offers',
        title: 'Making price offers & counter-negotiations',
        summary: 'Propose fair discounts and lock in agreed prices safely.',
        content: [
          'Click "Make Offer" on any listing to suggest a price (e.g. -5%, -10%, -15%).',
          'The seller can accept, decline, or counter your offer in the Messages thread.',
          'Once accepted, click "Lock Agreed Price into Escrow" to purchase at the discounted rate.'
        ]
      },
      {
        id: 'delivery-vs-pickup',
        title: 'Doorstep Delivery vs Local Self-Pickup',
        summary: 'Choose the best handover method for your location.',
        content: [
          'Self-Pickup (FREE): Meet the seller locally at a public landmark (chowk, mall, tea shop).',
          'Doorstep Delivery (+ Rs. 180): Item is delivered to your address with 48h inspection protection.'
        ]
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Verification',
    description: 'Profile settings, Nagarikta ID verification, and trust standards.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    articles: [
      {
        id: 'profile-settings',
        title: 'Updating name, phone & default delivery area',
        summary: 'Keep your contact details up to date for smooth coordination.',
        content: [
          'Click your profile avatar in the top navbar and select "Edit Profile".',
          'Update your default city (Kathmandu, Lalitpur, Pokhara, etc.) and landmark address.',
          'A verified Nepali phone number (98XXXXXXXX) ensures you receive SMS updates for offers.'
        ]
      },
      {
        id: 'id-verification',
        title: 'Nagarikta / ID verification badge benefits',
        summary: 'Boost buyer trust with a verified checkmark badge.',
        content: [
          'Verified sellers receive a blue checkmark badge next to their name.',
          'Listings from verified sellers receive 3x more views and sell faster in the explore feed.',
          'ID verification helps maintain a scam-free peer-to-peer marketplace in Nepal.'
        ]
      },
      {
        id: 'reset-password',
        title: 'Resetting forgotten passwords via email',
        summary: 'Recover account access securely.',
        content: [
          'Go to the login screen and click "Forgot password?".',
          'Enter your registered email address to receive a secure password reset link.',
          'Click the link in your inbox to set a new password and sign back in.'
        ]
      },
      {
        id: 'trust-rules',
        title: 'Trust rules & zero-tolerance scam policies',
        summary: 'Our community guidelines to protect everyone.',
        content: [
          'Kinne Ho? operates a zero-tolerance policy against fraudulent sellers and fake listings.',
          'Any user attempting off-platform advance cash requests will be permanently banned.',
          'Disputed escrow funds are adjudicated by our team using photo evidence and chat history.'
        ],
        rules: [
          'Be respectful in chat communications.',
          'Do not share personal financial credentials or bank passwords.'
        ]
      }
    ]
  }
];

export const Safety: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useMarketplace();

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Arbiter Form State
  const [contactCategory, setContactCategory] = useState('Escrow Payment Issue');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTopic = HELP_DATA.find((t) => t.id === selectedTopicId);
  const selectedArticle = selectedTopic?.articles.find((a) => a.id === selectedArticleId);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please enter your query', 'Provide details so our arbiter team can assist you.', 'warning');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Request Submitted 🛡️', 'Our Escrow Arbiter team will review your case within 2 hours.', 'success');
      setMessage('');
      setOrderId('');
      setShowContactForm(false);
    }, 600);
  };

  // Filter articles based on search query
  const filteredArticles = searchQuery.trim()
    ? HELP_DATA.flatMap((topic) =>
        topic.articles
          .filter(
            (a) =>
              a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.summary.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((a) => ({ ...a, topicId: topic.id, topicTitle: topic.title }))
      )
    : [];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* 1. ARTICLE DETAIL VIEW (When user clicks an article) */}
      {selectedArticle && selectedTopic ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Breadcrumb Header */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <button
              onClick={() => {
                setSelectedArticleId(null);
                setSelectedTopicId(null);
              }}
              className="hover:text-[#1b7a53] font-medium cursor-pointer"
            >
              Help Center
            </button>
            <span>/</span>
            <button
              onClick={() => setSelectedArticleId(null)}
              className="hover:text-[#1b7a53] font-medium cursor-pointer"
            >
              {selectedTopic.title}
            </button>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-[200px]">
              {selectedArticle.title}
            </span>
          </nav>

          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
            <div className="space-y-2 border-b border-gray-100 pb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b7a53] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedTopic.title}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {selectedArticle.title}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedArticle.summary}
              </p>
            </div>

            {/* Main Content Guidelines */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1b7a53]" />
                <span>Guidelines & Process</span>
              </h3>
              <ul className="space-y-2.5 list-disc pl-5 text-gray-600">
                {selectedArticle.content.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>

            {/* Rules & Policies Box (If applicable) */}
            {selectedArticle.rules && selectedArticle.rules.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Rules & Regulations to Remember</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-5 text-xs text-amber-900/90">
                  {selectedArticle.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Escrow Guarantee Box */}
            <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#1b7a53] shrink-0" />
                <span className="text-gray-700">
                  All transactions on Kinne Ho? are backed by our double-locked Escrow & Handshake OTP protocol.
                </span>
              </div>
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Contact Support
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setSelectedArticleId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 pt-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {selectedTopic.title}</span>
            </button>
          </div>
        </div>
      ) : selectedTopicId && selectedTopic ? (
        
        /* 2. TOPIC "SEE ALL" FULL PAGE (When user clicks "See all" on a topic card) */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Breadcrumb Header */}
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <button
              onClick={() => setSelectedTopicId(null)}
              className="hover:text-[#1b7a53] font-medium cursor-pointer"
            >
              Help Center
            </button>
            <span>/</span>
            <span className="text-gray-900 font-bold">{selectedTopic.title}</span>
          </nav>

          {/* Topic Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white h-48 sm:h-56 shadow-lg">
            <img
              src={selectedTopic.image}
              alt={selectedTopic.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Topic Knowledge Base
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {selectedTopic.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mt-1">
                {selectedTopic.description}
              </p>
            </div>
          </div>

          {/* Full List of Articles & Regulations in this Topic */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              All Guides & Rules in this Section ({selectedTopic.articles.length})
            </h2>

            <div className="divide-y divide-gray-100">
              {selectedTopic.articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className="py-4 flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="space-y-1 pr-4 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1b7a53] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed truncate max-w-2xl">
                      {article.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1b7a53] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedTopicId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 pt-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all help topics</span>
            </button>
          </div>
        </div>
      ) : (

        /* 3. DEFAULT HELP HUB (Search + Topic Cards + Escrow Guide) */
        <div className="space-y-10 animate-in fade-in duration-150">
          
          {/* Top Hero Banner */}
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#1b7a53] text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[300px] sm:min-h-[340px]">
              
              {/* Left Column: Search & Title */}
              <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-5 z-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  How can we help?
                </h1>

                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type your question (e.g. Escrow, Handshake PIN, eSewa)..."
                    className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>

              {/* Right Column: Hero Graphic Banner */}
              <div className="lg:col-span-6 h-full min-h-[220px] lg:min-h-[340px] relative">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                  alt="Happy Nepali youth using mobile marketplace"
                  className="w-full h-full object-cover object-center mix-blend-luminosity opacity-40 lg:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1b7a53] via-transparent to-transparent"></div>
              </div>

            </div>
          </div>

          {/* Search Results Dropdown (If searching) */}
          {searchQuery.trim() !== '' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Search Results ({filteredArticles.length})
              </h3>
              {filteredArticles.length === 0 ? (
                <p className="text-xs text-gray-500">No articles found matching "{searchQuery}".</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedTopicId(art.topicId);
                        setSelectedArticleId(art.id);
                      }}
                      className="py-3 flex items-center justify-between hover:bg-gray-50 -mx-3 px-3 rounded-xl cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#1b7a53] uppercase">{art.topicTitle}</span>
                        <h4 className="text-xs font-bold text-gray-900">{art.title}</h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Specific Order Helper Banner */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-gray-900">
              I need help with a specific order or transaction
            </h2>

            <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100">
              <div>
                <p className="text-xs text-gray-600 font-medium">
                  {user
                    ? 'Check real-time escrow hold status, your 4-digit Handshake OTP, or open a dispute.'
                    : 'Log in to view active escrow orders, track Handshake verification, and contact support.'}
                </p>
              </div>

              {!user ? (
                <button
                  onClick={() => navigate('/auth?mode=select')}
                  className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs text-center"
                >
                  Log in or sign up
                </button>
              ) : (
                <button
                  onClick={() => navigate('/wallet')}
                  className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs text-center"
                >
                  View My Escrow Orders
                </button>
              )}
            </div>
          </div>

          {/* Browse by Topic Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Browse by topic</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HELP_DATA.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-2xs flex flex-col justify-between group hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Topic Image */}
                    <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-3 left-4 text-white font-extrabold text-base">
                        {topic.title}
                      </h3>
                    </div>

                    {/* Topic Articles */}
                    <div className="p-4 space-y-1">
                      {topic.articles.slice(0, 4).map((art) => (
                        <div
                          key={art.id}
                          onClick={() => {
                            setSelectedTopicId(topic.id);
                            setSelectedArticleId(art.id);
                          }}
                          className="text-xs text-gray-700 hover:text-[#1b7a53] hover:bg-gray-50 flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                        >
                          <span className="truncate pr-2 font-medium">{art.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Opens the Full Topic Rules Page */}
                  <div className="p-4 pt-0 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>See all {topic.articles.length} guides</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kinne Ho? 3-Pillar Security Architecture */}
          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#1b7a53] px-3 py-1 rounded-full text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nepali P2P Marketplace Guarantee</span>
              </div>
              <h3 className="text-xl font-black text-gray-900">
                How Escrow & Handshake PIN Protect Every Rupee
              </h3>
              <p className="text-xs text-gray-600">
                You are 100% protected against advance payment scams and fake product listings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-gray-900">Buyer Pays via eSewa/Khalti</h4>
                <p className="text-gray-500 leading-relaxed">
                  Money is held safely in Kinne Ho? Escrow. The seller does not receive payment yet.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-gray-900">In-Person Item Inspection</h4>
                <p className="text-gray-500 leading-relaxed">
                  Meet at a local chowk or receive doorstep delivery. Inspect condition, battery health, and fit.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-gray-900">4-Digit Handshake OTP</h4>
                <p className="text-gray-500 leading-relaxed">
                  Give your PIN to the seller only when satisfied. The seller enters the PIN to claim their wallet payout.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 border-t border-emerald-200/60">
              <span>Having an issue with an ongoing deal or escrow refund?</span>
              <button
                type="button"
                onClick={() => setShowContactForm(true)}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Contact Escrow Arbiter
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 4. CONTACT US & ESCROW ARBITER MODAL */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Contact Escrow Arbiter & Support
                </h3>
                <p className="text-xs text-gray-500">
                  Direct ticket to our Kathmandu moderation desk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Issue Category</label>
                <select
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                >
                  <option value="Escrow Payment Issue">Escrow Payment Hold / Release Issue</option>
                  <option value="Dispute Item Condition">Dispute Item Condition (Doesn't Match Listing)</option>
                  <option value="Handshake PIN Not Working">Handshake 4-Digit PIN Error</option>
                  <option value="Seller Did Not Show Up">Seller / Buyer Did Not Arrive at Meeting Point</option>
                  <option value="Report Scam Account">Report Suspicious / Fake Account</option>
                  <option value="General Question">General Question about Kinne Ho?</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Order ID or Product Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. KH-8941 or iPhone 13"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Describe Your Issue *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe what happened, transaction details, or what assistance you need..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                />
              </div>

              <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-xl p-3 text-[11px] text-gray-600 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#1b7a53] shrink-0" />
                <span>Our arbiter team can freeze or refund escrow funds if fraud is detected.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to Arbiter...' : 'Submit Support Request'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};