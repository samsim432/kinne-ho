import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl p-4 shadow-xl flex items-start gap-3 transform transition-all animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : t.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#1b7a53]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900">{t.title}</h4>
            {t.description && <p className="text-[11px] text-gray-500 mt-0.5">{t.description}</p>}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};