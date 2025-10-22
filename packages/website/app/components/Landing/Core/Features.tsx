import React from "react";
import { Brain, Cloud, Folder, Sparkles, Zap } from "lucide-react";
import IconCard from "../Others/icons";

const Features = () => {
  return (
    <div>
      <div className="text-center mb-5">
        <p className="mb-5 text-lg text-sky-500 ">How Sparky Works</p>
        <h2 className="text-2xl text-muted-foreground font-semibold">
          Three powerful features that transform how you save and rediscover
          content
        </h2>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 - updated icon */}
        <div className="p-6 bg-card rounded-2xl shadow-sm">
          <IconCard
            IconPrimary={Cloud}
            IconAccent={Zap}
            gradientClass="from-[#7EC8E3] to-[#4A90E2]"
          />
          <h4 className="mt-4 text-lg font-medium text-center">
            Automatic Content Capture
          </h4>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Save articles, videos, tweets, and posts with a single click. Our
            intelligent system captures everything you need, nothing you
            don&apos;t.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-card rounded-2xl shadow-sm">
          <IconCard
            IconPrimary={Brain}
            IconAccent={Sparkles}
            gradientClass="from-[#FFB347] to-[#FF9F2E]"
          />
          <h4 className="mt-4 text-lg font-medium text-center">
            AI-Powered Tagging & Emotion Detection
          </h4>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Our smart AI automatically tags content by topic and emotion. Find
            that inspiring article or funny video instantly.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-card rounded-2xl shadow-sm">
          <IconCard
            IconPrimary={Folder}
            IconAccent={Cloud}
            gradientClass="from-[#4A90E2] to-[#7EC8E3]"
            primaryClass="w-10 h-10 text-white"
            accentClass="w-5 h-5 text-white absolute translate-x-3 translate-y-3 opacity-70"
          />
          <h4 className="mt-4 text-lg font-medium text-center">
            Your Personal Memory Dashboard
          </h4>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Beautiful, organized dashboard to browse, search, and explore your
            memories. Filter by date, emotion, or topic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
