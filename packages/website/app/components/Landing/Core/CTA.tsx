import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    <div className="py-32 bg-gradient-to-br from-[#7EC8E3] via-[#4A90E2] to-[#7EC8E3] relative overflow-hidden text-white flex items-center flex-col gap-8 text-center">
      <div className="space-y-3 px-20">
        <p className="text-lg">Start Your Journey Through the Clouds Today</p>
        <h3 className="text-2xl text-semibold">
          Sign up and let your digital memories take flight. No credit card
          required, free forever.
        </h3>
      </div>

      <div className="flex gap-6">
        <Link href="/dashboard">
          <Button className="bg-[#FFB347] hover:bg-[#FF9F2E] text-white text-lg px-12 py-7 rounded-full shadow-2xl">
            Get Started Free
          </Button>
        </Link>
      </div>

      <ul className="flex gap-10 font-semibold">
        <li className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span>Unlimited storage</span>
        </li>

        <li className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span>AI-Powered Search</span>
        </li>

        <li className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span>Privacy-First</span>
        </li>
      </ul>
    </div>
  );
};

export default CTA;
