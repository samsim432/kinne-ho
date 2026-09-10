import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden flex flex-col animate-pulse">
      {/* Image frame shimmer */}
      <div className="aspect-square w-full bg-gray-200 relative">
        <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-gray-300/80" />
        <div className="absolute top-2.5 right-2.5 w-16 h-5 rounded-md bg-gray-300/80" />
      </div>

      {/* Details Box shimmer */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title bar */}
          <div className="h-4 bg-gray-200 rounded-md w-3/4" />
          {/* Price row */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded-md w-1/3" />
            <div className="h-3 bg-gray-200 rounded-md w-1/4" />
          </div>
        </div>

        {/* Location & Seller footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded-md w-1/3" />
          <div className="h-3 bg-gray-200 rounded-md w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const ChatThreadSkeleton: React.FC = () => {
  return (
    <div className="p-3 rounded-2xl flex items-center gap-3 animate-pulse bg-gray-100/60">
      <div className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="h-3.5 bg-gray-200 rounded w-1/3" />
          <div className="h-2.5 bg-gray-200 rounded w-10" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
};