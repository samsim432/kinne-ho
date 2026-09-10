import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { ImageUploader } from '../components/sell/ImageUploader';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Loader2,
  Tv,
  Shirt,
  Gamepad2,
  Armchair,
  BookOpen
} from 'lucide-react';

interface DefectOption {
  id: string;
  label: string;
}

const DEFECTS_MAP: Record<string, DefectOption[]> = {
  Clothing: [
    { id: 'stains', label: 'Stains or marks' },
    { id: 'tears', label: 'Tears or loose stitching' },
    { id: 'fading', label: 'Color fading / wash wear' },
    { id: 'missing_buttons', label: 'Missing button or faulty zipper' },
  ],
  Electronics: [
    { id: 'scratches', label: 'Screen or body scratches' },
    { id: 'battery', label: 'Degraded battery (< 80% health)' },
    { id: 'camera_speaker', label: 'Minor camera or speaker defect' },
    { id: 'dent', label: 'Body dent or drop marks' },
  ],
  Gaming: [
    { id: 'stick_drift', label: 'Minor joystick drift' },
    { id: 'disc_drive', label: 'Disc drive requires hard push' },
    { id: 'scratched_casing', label: 'Scratched plastic shell' },
    { id: 'missing_cables', label: 'Missing original HDMI or power cord' },
  ],
  Furniture: [
    { id: 'scratched_wood', label: 'Surface scratches on wood/glass' },
    { id: 'wobbly', label: 'Slight wobble or needs screw tightening' },
    { id: 'fabric_stain', label: 'Fabric discoloration or small spot' },
  ],
  Books: [
    { id: 'highlighter', label: 'Highlighter / pencil notes inside' },
    { id: 'creased_cover', label: 'Creased cover or bent spine' },
    { id: 'yellowed_pages', label: 'Aged / yellowed paper edges' },
  ],
};

export const Sell: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useMarketplace();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core Form State — Clean Empty Defaults
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Electronics' | 'Clothing' | 'Gaming' | 'Furniture' | 'Books'>('Electronics');
  const [condition, setCondition] = useState('Good');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [location, setLocation] = useState('Kathmandu');
  const [description, setDescription] = useState('');
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);

  // 1. Electronics Specs
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [storageCapacity, setStorageCapacity] = useState('128GB');
  const [batteryHealth, setBatteryHealth] = useState('88%');
  const [hasWarranty, setHasWarranty] = useState('No');

  // 2. Clothing Specs
  const [gender, setGender] = useState('Unisex');
  const [clothingSize, setClothingSize] = useState('M');
  const [clothingColor, setClothingColor] = useState('');
  const [material, setMaterial] = useState('');

  // 3. Gaming Specs
  const [gamingPlatform, setGamingPlatform] = useState('PlayStation 5');
  const [gamingType, setGamingType] = useState('Console');
  const [includedControllers, setIncludedControllers] = useState('1 Controller');

  // 4. Furniture Specs
  const [furnitureMaterial, setFurnitureMaterial] = useState('Solid Wood');
  const [roomType, setRoomType] = useState('Living Room');
  const [dimensions, setDimensions] = useState('');

  // 5. Books Specs
  const [author, setAuthor] = useState('');
  const [bookGenre, setBookGenre] = useState('Self-Help / Business');
  const [bookLanguage, setBookLanguage] = useState('English');

  const toggleDefect = (id: string) => {
    setSelectedDefects((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (images.length === 0) {
        showToast('Photo required', 'Please upload at least 1 real photo of the item.', 'warning');
        return;
      }
      if (!title.trim()) {
        showToast('Title required', 'Please enter a clear listing title.', 'warning');
        return;
      }
    }
    if (step === 4 && (!price || Number(price) <= 0)) {
      showToast('Price required', 'Please enter a valid asking price in Rs.', 'warning');
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePublish = async () => {
    if (!user) {
      showToast('Authentication required', 'Please sign in to publish your item.', 'warning');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build tailored specifications JSON
      let specifications: Record<string, any> = {};

      if (category === 'Electronics') {
        specifications = {
          brand: brand.trim() || 'Generic',
          model: model.trim() || title,
          storage: storageCapacity,
          batteryHealth: batteryHealth.trim(),
          warranty: hasWarranty,
        };
      } else if (category === 'Clothing') {
        specifications = {
          gender,
          size: clothingSize,
          color: clothingColor.trim(),
          material: material.trim(),
          brand: brand.trim(),
        };
      } else if (category === 'Gaming') {
        specifications = {
          platform: gamingPlatform,
          type: gamingType,
          included: includedControllers,
        };
      } else if (category === 'Furniture') {
        specifications = {
          material: furnitureMaterial,
          room: roomType,
          dimensions: dimensions.trim(),
        };
      } else if (category === 'Books') {
        specifications = {
          author: author.trim(),
          genre: bookGenre,
          language: bookLanguage,
        };
      }

      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            seller_id: user.id,
            title: title.trim(),
            category_id: category.toLowerCase(),
            price: parseInt(price, 10),
            original_price: originalPrice ? parseInt(originalPrice, 10) : null,
            condition,
            location,
            description: description.trim(),
            brand: brand.trim() || null,
            model: model.trim() || null,
            specifications,
            defects: selectedDefects,
            images: images,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      showToast('Listing Live! 🎉', 'Your item has been published to the marketplace.', 'success');
      navigate(`/product/${data.id}`);
    } catch (err: any) {
      showToast('Publish Failed', err.message || 'Could not save listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      
      {/* Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-[#1b7a53]">
            {step === 1 && 'Photos & Basic Details'}
            {step === 2 && `${category} Specifications`}
            {step === 3 && 'Condition & Defects'}
            {step === 4 && 'Pricing & Escrow'}
            {step === 5 && 'Location'}
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

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Step 1: Photos & Basic Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Upload Photos & Basic Details</h2>
              <p className="text-xs text-gray-500">Items with clear photos sell within 48 hours in Nepal.</p>
            </div>

            <ImageUploader images={images} setImages={setImages} />

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-700">Listing Title *</label>
              <input
                type="text"
                placeholder="e.g. iPhone 13 128GB Midnight Black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { name: 'Electronics', icon: Tv },
                  { name: 'Clothing', icon: Shirt },
                  { name: 'Gaming', icon: Gamepad2 },
                  { name: 'Furniture', icon: Armchair },
                  { name: 'Books', icon: BookOpen },
                ].map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCategory(name as any)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      category === name
                        ? 'border-[#1b7a53] bg-emerald-50 text-[#1b7a53] shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dynamic Category Specifications */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{category} Specifications</h2>
              <p className="text-xs text-gray-500">Provide accurate details to help buyers find your item.</p>
            </div>

            {/* 1. ELECTRONICS */}
            {category === 'Electronics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Brand</label>
                    <input
                      type="text"
                      placeholder="Apple, Samsung, Sony..."
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Model</label>
                    <input
                      type="text"
                      placeholder="iPhone 13, Galaxy S23..."
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Storage Capacity</label>
                    <select
                      value={storageCapacity}
                      onChange={(e) => setStorageCapacity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
                    >
                      {['64GB', '128GB', '256GB', '512GB', '1TB', '2TB', 'Other'].map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Battery Health</label>
                    <input
                      type="text"
                      placeholder="e.g. 88% or Normal"
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Remaining Official Warranty?</label>
                  <div className="flex gap-2">
                    {['Yes (Under Warranty)', 'No (Expired)'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setHasWarranty(opt)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          hasWarranty === opt ? 'bg-[#1b7a53] text-white border-[#1b7a53]' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CLOTHING */}
            {category === 'Clothing' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Gender / Fit</label>
                  <div className="flex gap-2">
                    {['Men', 'Women', 'Unisex', 'Kids'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          gender === g ? 'bg-[#1b7a53] text-white border-[#1b7a53]' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Size</label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setClothingSize(s)}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer shrink-0 transition-all ${
                          clothingSize === s ? 'bg-[#1b7a53] text-white border-[#1b7a53]' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Navy Blue, Black..."
                      value={clothingColor}
                      onChange={(e) => setClothingColor(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Material / Fabric</label>
                    <input
                      type="text"
                      placeholder="Denim, Cotton, Wool, Fleece..."
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. GAMING */}
            {category === 'Gaming' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Gaming Platform</label>
                  <select
                    value={gamingPlatform}
                    onChange={(e) => setGamingPlatform(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
                  >
                    {['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Nintendo Switch', 'PC / Laptop', 'VR Headset', 'Retro Console'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Item Type</label>
                    <select
                      value={gamingType}
                      onChange={(e) => setGamingType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
                    >
                      {['Console', 'Game Disc/Card', 'Controller', 'Headset', 'Gaming Chair', 'Accessory'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Included In Box</label>
                    <input
                      type="text"
                      placeholder="1 Controller + HDMI cable..."
                      value={includedControllers}
                      onChange={(e) => setIncludedControllers(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. FURNITURE */}
            {category === 'Furniture' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Primary Material</label>
                    <select
                      value={furnitureMaterial}
                      onChange={(e) => setFurnitureMaterial(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
                    >
                      {['Solid Wood', 'Plywood / MDF', 'Metal / Steel', 'Fabric / Upholstered', 'Leather', 'Glass'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Room / Space</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
                    >
                      {['Living Room', 'Bedroom', 'Office / Study', 'Kitchen / Dining', 'Balcony / Outdoor'].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Approximate Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 ft (L) x 2.5 ft (W) x 3 ft (H)"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>
            )}

            {/* 5. BOOKS */}
            {category === 'Books' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. James Clear, BP Koirala..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Genre / Field</label>
                    <input
                      type="text"
                      placeholder="Fiction, Medical, Engineering, Novel..."
                      value={bookGenre}
                      onChange={(e) => setBookGenre(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Language</label>
                    <select
                      value={bookLanguage}
                      onChange={(e) => setBookLanguage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white"
                    >
                      {['English', 'Nepali', 'Hindi', 'Other'].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* General Description */}
            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-gray-700">Description & What's Included</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention why you are selling, usage history, and what accessories or bills come with it..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Condition & Defects */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Condition & Known Flaws</h2>
              <p className="text-xs text-gray-500">Disclosing flaws protects your seller reputation and escrow payouts.</p>
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
                        ? 'border-[#1b7a53] bg-emerald-50 text-[#1b7a53] shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 block">Check Any Existing Flaws</label>
              <div className="space-y-2">
                {(DEFECTS_MAP[category] || []).map((defect) => {
                  const isChecked = selectedDefects.includes(defect.id);
                  return (
                    <div
                      key={defect.id}
                      onClick={() => toggleDefect(defect.id)}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold text-gray-800">{defect.label}</span>
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-[#1b7a53] border-[#1b7a53] text-white' : 'border-gray-300'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Set Your Price</h2>
              <p className="text-xs text-gray-500">Fair prices receive offers 3x faster in Nepal.</p>
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

            <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 flex items-start gap-2.5 text-xs text-gray-700">
              <ShieldCheck className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
              <span>Buyers pay into Kinne Ho? Escrow. Funds release directly to your wallet upon confirmed handover.</span>
            </div>
          </div>
        )}

        {/* Step 5: Location */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Pickup Location</h2>
              <p className="text-xs text-gray-500">Where can buyers meet you for inspection and Handshake PIN exchange?</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">City / Valley *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Biratnagar', 'Dharan'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      location === loc
                        ? 'border-[#1b7a53] bg-emerald-50 text-[#1b7a53] shadow-xs'
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

        {/* Step 6: Review & Publish */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Review Your Listing</h2>
              <p className="text-xs text-gray-500">Confirm details before saving to the live database.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-4 items-center">
              <img src={images[0]} alt="Preview" className="w-20 h-20 rounded-xl object-cover bg-gray-200 border border-gray-200" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#1b7a53] px-2 py-0.5 rounded">
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

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
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
              disabled={isSubmitting}
              onClick={handlePublish}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
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
    </div>
  );
};