import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  uniqueCategories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  itemVariants: any;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  uniqueCategories, selectedCategory, setSelectedCategory, 
  searchTerm, setSearchTerm, itemVariants 
}) => {
  return (
    <motion.div variants={itemVariants} className="lg:col-span-12 md:col-span-4 mt-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center font-sans">
      <h2 className="text-2xl font-[800] tracking-tight text-[#172033] shrink-0">
        Live Experiences
      </h2>
      
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-[#667085] mr-2 shrink-0" />
          {uniqueCategories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-[700] transition-all shrink-0 border ${
                selectedCategory === cat 
                  ? 'bg-[#6C5CE7] border-[#6C5CE7] text-[#FFFFFF] shadow-[0_4px_14px_rgba(108,92,231,0.25)]' 
                  : 'bg-[#FFFFFF] border-gray-200 text-[#667085] hover:bg-[#F8F9FC] hover:border-[#6C5CE7]/50 hover:text-[#172033]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm font-[500] text-[#172033] placeholder:text-[#667085] placeholder:font-[400] focus:outline-none focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/10 transition-all shadow-sm"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;