import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CategoryType, ConditionType } from '../types/marketplace';

const CATEGORIES: CategoryType[] = ['Clothing', 'Furniture', 'Gaming', 'Electronics', 'Books'];
const CONDITIONS: ConditionType[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal'];

export const Sell: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Clothing');
  const [condition, setCondition] = useState<ConditionType>('Good');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Kathmandu');
  const [description, setDescription] = useState('');
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  const defectsList = [
    'Minor scratches',
    'Color fading',
    'No original box',
    'Repaired once',
    'None / Perfect'
  ];

  const toggleDefect = (defect: string) => {
    setSelectedDefects((prev) =>
      prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublished(true);
    setTimeout(() => {
      navigate('/explore');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sell an Item</h1>
        <p className="text-sm text-gray-500 mt-1">
          Turn your unused items into cash. Give them a second life in Nepal.
        </p>
      </div>

      {isPublished ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#1b7a53]/10 text-[#1b7a53] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Listing Published!</h2>
          <p className="text-sm text-gray-500">Redirecting to marketplace...</p>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Photo Upload Area */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              Item Photos
            </label>
            <div className="border-2 border-dashed border-gray-200 hover:border-[#1b7a53] rounded-xl p-8 text-center space-y-2 cursor-pointer transition-colors bg-gray-50/50">
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">Click to upload photos</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB (Upload 3–5 clear angles)</p>
            </div>
          </div>

          {/* Details & Category */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900">Listing Information</h3>
            
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Nike Winter Jacket Size M or iPhone 13 128GB"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ConditionType)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Defect Disclosure Picker */}
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-2">Disclose Defects (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {defectsList.map((defect) => (
                  <button
                    type="button"
                    key={defect}
                    onClick={() => toggleDefect(defect)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedDefects.includes(defect)
                        ? 'bg-[#1b7a53] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {defect}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Describe why you are selling, usage history, accessories included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          {/* Pricing and Location */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900">Pricing & Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">City / Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3.5 rounded-xl transition-all shadow-xs cursor-pointer text-sm"
          >
            Publish Listing
          </button>
        </form>
      )}

    </div>
  );
};