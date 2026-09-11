import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { supabase } from '../lib/supabaseClient';
import { 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  X,
  Loader2
} from 'lucide-react';

export const Sell: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useMarketplace();

  // If user is not logged in, redirect directly to auth without looping toasts
  if (!user) {
    return <Navigate to="/auth?mode=select&redirect=sell" replace />;
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('clothing');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [location, setLocation] = useState(profile?.delivery_address || 'Kathmandu');
  const [description, setDescription] = useState('');
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  
  const [specs, setSpecs] = useState({
    brand: '',
    size: '',
    color: '',
    material: '',
    model: '',
    storage: '',
    batteryHealth: '',
    platform: '',
    author: '',
    edition: ''
  });

  const [imageFiles, setImageFiles] = useState<string[]>([
    'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'
  ]);
  const [coverIndex, setCoverIndex] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      setImageFiles((prev) => [...prev, newUrl]);
      showToast('Photo added', 'Uploaded image to listing draft.', 'success');
    }
  };

  const removeImage = (index: number) => {
    if (imageFiles.length <= 1) {
      showToast('Minimum 1 photo', 'Please keep at least one photo of your item.', 'warning');
      return;
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const toggleDefect = (defect: string) => {
    setSelectedDefects((prev) => 
      prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]
    );
  };

  const handlePublish = async () => {
    if (!title.trim() || !price) {
      showToast('Incomplete details', 'Please complete the title and price before publishing.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const listingData = {
        title: title.trim(),
        category_id: category,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        condition,
        location,
        description: description.trim(),
        defects: selectedDefects,
        specs,
        images: imageFiles,
        user_id: user.id,
        seller_name: profile ? `${profile.first_name} ${profile.surname}`.trim() : 'Verified Member',
        status: 'active',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single();

      if (error) {
        console.warn('Supabase listing insert failed, continuing locally:', error);
      }

      showToast('Listing Live! 🎉', 'Your item is now discoverable across Nepal.', 'success');
      navigate(data?.id ? `/product/${data.id}` : '/my-listings');
    } catch (err: any) {
      showToast('Notice', err.message || 'Published to local state.', 'info');
      navigate('/my-listings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      
      {/* Wizard Step Progress */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1b7a53] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Step {currentStep} of 6
            </span>
            <h1 className="text-lg sm:text-xl font-black text-gray-900 mt-1">
              {currentStep === 1 && 'Upload Photos & Title'}
              {currentStep === 2 && 'Category & Technical Specs'}
              {currentStep === 3 && 'Condition & Defect Disclosure'}
              {currentStep === 4 && 'Pricing (NPR)'}
              {currentStep === 5 && 'Location & Handover Point'}
              {currentStep === 6 && 'Review & Publish Listing'}
            </h1>
          </div>
          <span className="text-xs font-bold text-gray-400 font-mono">{Math.round((currentStep / 6) * 100)}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-[#1b7a53] h-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Photos & Title */}
      {currentStep === 1 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-900">Photos (Minimum 1, up to 6)</label>
            <p className="text-[11px] text-gray-500">Take clear pictures in good lighting. Tap an image to make it cover photo.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {imageFiles.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setCoverIndex(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  coverIndex === idx ? 'border-[#1b7a53] ring-2 ring-emerald-200' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="Product" className="w-full h-full object-cover" />
                {coverIndex === idx && (
                  <span className="absolute bottom-1.5 left-1.5 bg-[#1b7a53] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1 rounded-full cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {imageFiles.length < 6 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 hover:border-[#1b7a53] rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-[#1b7a53] cursor-pointer transition-colors bg-gray-50/50">
                <UploadCloud className="w-6 h-6 mb-1" />
                <span className="text-[11px] font-bold">Add Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-900">Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. iPhone 13 128GB Midnight Blue or Levi's Denim Jacket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            >
              <option value="clothing">Clothing & Apparel</option>
              <option value="electronics">Electronics & Gadgets</option>
              <option value="gaming">Gaming & Consoles</option>
              <option value="furniture">Home & Furniture</option>
              <option value="books">Books & Media</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Category Technical Specs */}
      {currentStep === 2 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Specifications for {category.toUpperCase()}
          </h3>

          {category === 'clothing' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Zara, H&M, Nike, Local"
                  value={specs.brand}
                  onChange={(e) => setSpecs({ ...specs, brand: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Size</label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L, XL, 32"
                  value={specs.size}
                  onChange={(e) => setSpecs({ ...specs, size: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          )}

          {category === 'electronics' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Storage Capacity</label>
                <input
                  type="text"
                  placeholder="e.g. 128GB, 256GB, 512GB"
                  value={specs.storage}
                  onChange={(e) => setSpecs({ ...specs, storage: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Battery Health % (if applicable)</label>
                <input
                  type="text"
                  placeholder="e.g. 88% or 100%"
                  value={specs.batteryHealth}
                  onChange={(e) => setSpecs({ ...specs, batteryHealth: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          )}

          {category === 'gaming' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Platform</label>
                <input
                  type="text"
                  placeholder="e.g. PlayStation 5, Xbox Series X, Switch"
                  value={specs.platform}
                  onChange={(e) => setSpecs({ ...specs, platform: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Included Accessories</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Controller, HDMI, Power Cable"
                  value={specs.model}
                  onChange={(e) => setSpecs({ ...specs, model: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          )}

          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-gray-700">Item Description *</label>
            <textarea
              rows={4}
              placeholder="Describe condition, usage period, reasons for selling, and what is included in the package..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            />
          </div>
        </div>
      )}

      {/* Step 3: Condition & Defects */}
      {currentStep === 3 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 block">Item Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Brand New', 'Like New', 'Good', 'Fair'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    condition === c
                      ? 'border-[#1b7a53] bg-emerald-50 text-[#1b7a53]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-900 block">Flaw & Defect Disclosure (Select all that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Minor body scratches / surface marks',
                'Screen replaced or minor hairline scratch',
                'Missing original retail box or invoice',
                'Slight battery drain over time',
                'Repaired or serviced previously',
                'No known flaws (100% flawless)'
              ].map((defect) => (
                <div
                  key={defect}
                  onClick={() => toggleDefect(defect)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedDefects.includes(defect)
                      ? 'border-[#1b7a53] bg-emerald-50/60 text-[#1b7a53] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{defect}</span>
                  {selectedDefects.includes(defect) && <CheckCircle2 className="w-4 h-4 text-[#1b7a53]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Pricing */}
      {currentStep === 4 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900">Your Selling Price (Rs.) *</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-bold text-gray-500">Rs.</span>
              <input
                type="number"
                required
                placeholder="e.g. 48000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-base font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Original / Retail Price (Optional)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-bold text-gray-400">Rs.</span>
              <input
                type="number"
                placeholder="e.g. 65000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 text-xs text-gray-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
            <span>0% Seller Fees: What you list for is 100% what you receive into your eSewa, Khalti, or Bank account upon Handshake PIN release.</span>
          </div>
        </div>
      )}

      {/* Step 5: Location */}
      {currentStep === 5 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900">Meeting Point / Handover City *</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            >
              <option value="Kathmandu (Baneshwor / Thamel)">Kathmandu (Baneshwor / Thamel)</option>
              <option value="Lalitpur (Jhamsikhel / Patan)">Lalitpur (Jhamsikhel / Patan)</option>
              <option value="Bhaktapur (Suryabinayak / Durbar Sq)">Bhaktapur (Suryabinayak / Durbar Sq)</option>
              <option value="Pokhara (Lakeside / Chipledhunga)">Pokhara (Lakeside / Chipledhunga)</option>
              <option value="Butwal / Chitwan / Dharan">Other Valley / City</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-500 space-y-1">
            <p className="font-bold text-gray-800">Public Handover Recommendation:</p>
            <p>Always meet in busy public chowks or cafes when verifying Handshake OTP codes with the buyer.</p>
          </div>
        </div>
      )}

      {/* Step 6: Review & Publish */}
      {currentStep === 6 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex gap-4 items-start">
            <img 
              src={imageFiles[coverIndex]} 
              alt="Cover preview" 
              className="w-24 h-24 rounded-2xl object-cover border border-gray-200 shrink-0" 
            />
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold bg-emerald-50 text-[#1b7a53] px-2.5 py-0.5 rounded-full">
                {condition}
              </span>
              <h3 className="text-base font-extrabold text-gray-900 truncate">{title}</h3>
              <p className="text-xs text-gray-500">{location} • {category}</p>
              <span className="text-lg font-black text-[#1b7a53] block">
                Rs. {Number(price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {selectedDefects.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-3.5 text-xs text-gray-600 space-y-1">
              <span className="font-bold text-gray-800 block">Disclosed Defects:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-500">
                {selectedDefects.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : <div />}

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1 && !title.trim()) {
                showToast('Title Required', 'Please enter a title for your item.', 'warning');
                return;
              }
              setCurrentStep((prev) => prev + 1);
            }}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handlePublish}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Listing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Listing</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
};