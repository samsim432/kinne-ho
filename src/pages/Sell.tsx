import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { ImageUploader } from '../components/sell/ImageUploader';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Tag
} from 'lucide-react';

interface DefectOption {
  id: string;
  label: string;
}

const CLOTHING_DEFECTS: DefectOption[] = [
  { id: 'stains', label: 'Stains or marks' },
  { id: 'tears', label: 'Tears or loose seams' },
  { id: 'fading', label: 'Color fading' },
  { id: 'broken_zip', label: 'Broken zip / missing button' },
];

const ELECTRONICS_DEFECTS: DefectOption[] = [
  { id: 'screen_scratch', label: 'Screen scratches / cracks' },
  { id: 'battery_degraded', label: 'Battery drains quickly (<80%)' },
  { id: 'port_issue', label: 'Charging port or speaker issue' },
  { id: 'dent', label: 'Frame dents / heavy scuffs' },
];

export const Sell: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useMarketplace();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Form State
  const [category, setCategory] = useState<'Clothing' | 'Furniture' | 'Gaming' | 'Electronics' | 'Books'>('Electronics');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('Good');
  const [batteryHealth, setBatteryHealth] = useState('88%');
  const [clothingSize, setClothingSize] = useState('M');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [location, setLocation] = useState('Kathmandu');
  const [description, setDescription] = useState('');
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
  ]);

  const toggleDefect = (id: string) => {
    setSelectedDefects((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        showToast('Please enter a listing title', '', 'warning');
        return;
      }
      if (images.length === 0) {
        showToast('Please upload at least 1 photo', '', 'warning');
        return;
      }
    }
    if (step === 4 && !price) {
      showToast('Please set your asking price', '', 'warning');
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePublish = () => {
    showToast('Listing published successfully! 🎉', 'Your item is now live on the marketplace', 'success');
    navigate('/my-listings');
  };

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      
      {/* Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-[#1b7a53]">
            {step === 1 && 'Photos & Basic Details'}
            {step === 2 && 'Category Specifications'}
            {step === 3 && 'Condition & Defects'}
            {step === 4 && 'Pricing & Escrow'}
            {step === 5 && 'Location & Handover'}
            {step === 6 && 'Preview & Publish'}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#1b7a53] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Card Container */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* STEP 1: Photos, Title & Category */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Upload Photos & Basic Details</h2>
              <p className="text-xs text-gray-500">Items with clear photos sell within 48 hours in Nepal.</p>
            </div>

            {/* Interactive Image Uploader */}
            <ImageUploader images={images} setImages={setImages} />

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-700">Listing Title *</label>
              <input
                type="text"
                placeholder="e.g. iPhone 13 128GB Midnight Black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Clothing', 'Furniture', 'Gaming', 'Electronics', 'Books'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      category === cat
                        ? 'border-[#1b7a53] bg-[#1b7a53]/10 text-[#1b7a53]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Category Specific Specs */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{category} Specifications</h2>
              <p className="text-xs text-gray-500">Structured details help buyers find your item and prevent returns.</p>
            </div>

            {category === 'Electronics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Apple"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Model</label>
                    <input
                      type="text"
                      placeholder="e.g. iPhone 13"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Battery Health (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. 87%"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>
            )}

            {category === 'Clothing' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Size</label>
                  <div className="flex gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setClothingSize(sz)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                          clothingSize === sz
                            ? 'border-[#1b7a53] bg-[#1b7a53] text-white'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Description & What's Included</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include details like included accessories, reason for selling, and usage duration..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Condition & Defects */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Condition & Known Defects</h2>
              <p className="text-xs text-gray-500">Disclosing flaws protects you from dispute refunds.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Item Condition *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Brand New', 'Like New', 'Good', 'Fair'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      condition === c
                        ? 'border-[#1b7a53] bg-[#1b7a53]/10 text-[#1b7a53]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 block">Check Any Existing Flaws (if any)</label>
              <div className="space-y-2">
                {(category === 'Clothing' ? CLOTHING_DEFECTS : ELECTRONICS_DEFECTS).map((defect) => {
                  const isChecked = selectedDefects.includes(defect.id);
                  return (
                    <div
                      key={defect.id}
                      onClick={() => toggleDefect(defect.id)}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium text-gray-800">{defect.label}</span>
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[#1b7a53] border-[#1b7a53] text-white' : 'border-gray-300'}`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Pricing */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Set Your Price</h2>
              <p className="text-xs text-gray-500">Competitive prices sell 3x faster in Nepal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Selling Price (Rs.) *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-gray-500">Rs.</span>
                  <input
                    type="number"
                    placeholder="48000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-base font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Original / Bought Price (Optional)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-gray-500">Rs.</span>
                  <input
                    type="number"
                    placeholder="52000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-xl p-4 flex items-start gap-2.5 text-xs text-gray-700">
              <ShieldCheck className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
              <span>Buyers will pay directly into Kinne Ho? Escrow. You receive payouts instantly to your wallet upon confirmed handover.</span>
            </div>
          </div>
        )}

        {/* STEP 5: Location */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pickup Location</h2>
              <p className="text-xs text-gray-500">Where can buyers meet you for inspection and Handshake OTP?</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">City / Area *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      location === loc
                        ? 'border-[#1b7a53] bg-[#1b7a53]/10 text-[#1b7a53]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Summary Preview */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review Your Listing</h2>
              <p className="text-xs text-gray-500">Make sure everything looks accurate before publishing.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-4 items-center">
              <img src={images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'} alt="Preview" className="w-20 h-20 rounded-xl object-cover bg-gray-200" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1b7a53]/10 text-[#1b7a53] px-2 py-0.5 rounded">
                  {category} · {condition}
                </span>
                <h3 className="text-sm font-bold text-gray-900">{title || 'Untitled Item'}</h3>
                <p className="text-sm font-extrabold text-[#1b7a53]">
                  Rs. {Number(price || 0).toLocaleString()}
                </p>
                <span className="text-xs text-gray-400 block">{location} • {images.length} photos</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Listing</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};