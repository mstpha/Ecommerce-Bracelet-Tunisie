import React from 'react';
import { Sparkles } from 'lucide-react';
import ShopItemsug from './ShopItemsug';

const Suggestions = ({ suggestions }) => {
  const truncateDescription = (description, maxLength = 60) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trim() + '...';
  };
  
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#1A9D8F] to-transparent opacity-30"></div>
      </div>
      
      <div className="bg-gradient-to-br from-[#E8F5F4] to-[#F0F9F8] rounded-2xl p-6 shadow-lg border-2 border-[#1A9D8F]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A9D8F]/10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1A9D8F]/10 rounded-tr-full"></div>
        
        <div className="flex items-center justify-center mb-6 relative z-10">
          <div className="bg-white rounded-full p-3 shadow-md mr-3">
            <Sparkles className="text-[#1A9D8F]" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#4A3C31]">Suggestions Pour Vous</h2>
            <p className="text-sm text-[#1A9D8F] font-medium">Articles sélectionnés spécialement</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
          {suggestions.map((item) => (
            <div key={item.id} className="transform transition-transform hover:scale-105">
              <ShopItemsug item={item} truncateDescription={truncateDescription} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-6">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#1A9D8F] to-transparent opacity-30"></div>
      </div>
    </div>
  );
};

export default Suggestions;