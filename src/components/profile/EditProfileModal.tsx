import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, User, Smartphone, MapPin, CheckCircle2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, refreshProfile } = useAuth();
  const { showToast } = useMarketplace();

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setSurname(profile.surname || '');
      setPhone(profile.phone || '');
      setDeliveryAddress(profile.delivery_address || '');
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          surname: surname.trim(),
          phone: phone.trim(),
          delivery_address: deliveryAddress.trim(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      showToast('Profile Updated! 🎉', 'Your personal details were saved.', 'success');
      onClose();
    } catch (err: any) {
      showToast('Update Failed', err.message || 'Could not update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
          <p className="text-xs text-gray-500">Update your account name, mobile, and default location.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Surname</label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Mobile Number (Nepal)</label>
            <div className="relative flex items-center">
              <Smartphone className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Default Delivery Address / Area</label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="text"
                placeholder="e.g. New Baneshwor, Kathmandu"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};