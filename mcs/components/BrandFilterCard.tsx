import React from "react";

interface BrandFilterCardProps {
  brand: string;
  selected: boolean;
  onClick: (brand: string) => void;
}

const BrandFilterCard: React.FC<BrandFilterCardProps> = ({ brand, selected, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg border font-semibold shadow-sm mr-2 mb-2 transition-colors text-sm 
        ${selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
      onClick={() => onClick(brand)}
      type="button"
    >
      {brand}
    </button>
  );
};

export default BrandFilterCard;
