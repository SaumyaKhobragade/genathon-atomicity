import React from "react";


type ChipProps = {
  label?: string;
  emoji?: string;
};
const Chip = ({ label, emoji }: ChipProps) => {
  return (
    <div className="inline-flex items-center px-3 py-3 rounded-full gradient text-sm font-medium space-x-2">
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </div>
  );
};

export default Chip;
