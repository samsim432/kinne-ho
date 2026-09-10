import React, { useRef } from 'react';
import { Plus, X, Star, Image as ImageIcon } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useMarketplace();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 8) {
      showToast('Photo limit reached', 'You can upload a maximum of 8 photos.', 'warning');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Invalid file format', 'Please upload JPG, PNG, or WEBP images only.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setAsCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    setImages((prev) => {
      const selected = prev[indexToCover];
      const rest = prev.filter((_, idx) => idx !== indexToCover);
      return [selected, ...rest];
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-gray-700">
          Item Photos ({images.length}/8)
        </label>
        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          JPG, PNG, WEBP
        </span>
      </div>

      <p className="text-[11px] text-gray-500">
        First photo is the cover. Click "Cover" on any photo to make it primary.
      </p>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Upload Trigger Button */}
        {images.length < 8 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 hover:border-[#1b7a53] hover:bg-emerald-50/40 rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#1b7a53]/10 text-gray-500 group-hover:text-[#1b7a53] flex items-center justify-center transition-colors mb-1">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-gray-700 group-hover:text-[#1b7a53]">Add Photos</span>
            <span className="text-[10px] text-gray-400">or click to browse</span>
          </button>
        )}

        {/* Uploaded Images List */}
        {images.map((imgUrl, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-gray-50 group shadow-2xs ${
              index === 0 ? 'border-[#1b7a53]' : 'border-gray-200'
            }`}
          >
            <img src={imgUrl} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />

            {/* Cover Badge */}
            {index === 0 ? (
              <span className="absolute top-2 left-2 bg-[#1b7a53] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-white" />
                Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setAsCover(index)}
                className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
              >
                Set Cover
              </button>
            )}

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};