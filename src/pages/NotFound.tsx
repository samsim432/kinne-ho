import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PackageX, ArrowRight, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 flex items-center justify-center text-center">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 max-w-md w-full space-y-5 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center mx-auto">
          <PackageX className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold text-[#1b7a53] uppercase tracking-wider">404 Error</span>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Listing or Page Not Found</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            The item you are looking for might have been sold, deleted, or the URL is incorrect.
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="flex-1 bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};