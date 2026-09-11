import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 max-w-md mx-auto text-center space-y-6">
      <div className="space-y-2">
        <span className="text-6xl font-black text-[#1b7a53]">404</span>
        <h1 className="text-2xl font-extrabold text-gray-900">Page Not Found</h1>
        <p className="text-xs text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};