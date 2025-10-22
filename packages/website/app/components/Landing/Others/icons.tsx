import React from "react";
import { LucideIcon } from "lucide-react";

type IconCardProps = {
  IconPrimary: LucideIcon;
  IconAccent?: LucideIcon;
  primaryClass?: string;
  accentClass?: string;
  // Tailwind gradient classes, e.g. "from-[#7EC8E3] to-[#4A90E2]"
  gradientClass?: string;
  className?: string;
};

/**
 * Reusable icon card for feature tiles.
 * Returns the same markup used in Features.tsx but parameterized.
 */
export const IconCard: React.FC<IconCardProps> = ({
  IconPrimary: Primary,
  IconAccent: Accent,
  primaryClass = "w-10 h-10 text-white",
  accentClass = "w-6 h-6 text-[#FFB347] absolute translate-x-2 translate-y-2",
  gradientClass = "from-[#7EC8E3] to-[#4A90E2]",
  className = "",
}) => {
  return (
    <div
      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg mx-auto relative ${className}`}
    >
      <Primary className={primaryClass} />
      {Accent ? <Accent className={accentClass} /> : null}
    </div>
  );
};

export default IconCard;
