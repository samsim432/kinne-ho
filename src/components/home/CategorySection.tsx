import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES_DATA } from '../../data/mockData';

export const CategorySection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4 py-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Explore Categories</h2>
          <p className="text-sm text-gray-500 mt-0.5">Five places to start looking.</p>
        </div>
        <button
          onClick={() => navigate('/explore')}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#1b7a53] hover:text-[#156343] transition-colors cursor-pointer group"
        >
          <span>See all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {CATEGORIES_DATA.map((cat) => (
          <div
            key={cat.name}
            onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.name)}`)}
            className="group relative bg-white border border-gray-200/90 rounded-xl p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm cursor-pointer flex flex-col justify-between h-32"
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{cat.icon}</span>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#1b7a53] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">{cat.tagline}</p>
              <span className="text-[11px] text-gray-400 font-medium block mt-1">
                {cat.itemCount} items listed
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};