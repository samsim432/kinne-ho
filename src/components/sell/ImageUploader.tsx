import React, { useRef } from 'react';
import { Camera, Trash2, Star, Plus, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  const handleDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const filtered = prev.filter((_, i) => i !== index);
      return [target, ...filtered];
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-gray-800 block">
            Item Photos ({images.length}/8)
          </label>
          <span className="text-[11px] text-gray-500">
            First photo is the cover. Click "Cover" on any photo to make it primary.
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#1b7a53] bg-[#1b7a53]/10 px-2 py-0.5 rounded-full">
          JPG, PNG, WEBP
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Upload Trigger Button */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-[#1b7a53] rounded-2xl aspect-square flex flex-col items-center justify-center text-gray-400 hover:text-[#1b7a53] transition-all cursor-pointer bg-gray-50/50 group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-gray-500 group-hover:text-[#1b7a53]" />
          </div>
          <span className="text-xs font-bold text-gray-700">Add Photos</span>
          <span className="text-[10px] text-gray-400">or click to browse</span>
        </div>

        {/* Uploaded Images List */}
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 group transition-all ${
              idx === 0 ? 'border-[#1b7a53] shadow-xs' : 'border-gray-200'
            }`}
          >
            <img src={imgUrl} alt={`Upload ${idx}`} className="w-full h-full object-cover" />

            {/* Cover Badge */}
            {idx === 0 && (
              <span className="absolute top-2 left-2 bg-[#1b7a53] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Cover
              </span>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="w-7 h-7 rounded-lg bg-white/90 text-red-600 hover:bg-white flex items-center justify-center cursor-pointer shadow-xs"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  className="w-full bg-white/95 text-gray-900 hover:text-[#1b7a53] text-[10px] font-bold py-1.5 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1"
                >
                  <Star className="w-3 h-3 text-amber-500" />
                  <span>Set as Cover</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};