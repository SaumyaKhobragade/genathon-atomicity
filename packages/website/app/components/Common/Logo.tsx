import { Brain, Cloud } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
      <Cloud className="w-6 h-6 text-[#4A90E2]" />
      <Brain className="w-4 h-4 text-[#FFB347] absolute translate-x-2 translate-y-2" />
    </div>
  );
};

export default Logo;
