import React from "react";
import IconCard from "../Others/icons";
import { Shield, Lock, Eye } from "lucide-react";
import Link from "next/link";
const Privacy = () => {
  const cards = [
    {
      id: "encryption",
      IconPrimary: Shield,
      gradientClass: "from-[#7EC8E3] to-[#4A90E2]",
      title: "End-to-End Encryption",
      description:
        "All your memories are encrypted both in transit and at rest. Only you have access to your data.",
    },
    {
      id: "no-selling",
      IconPrimary: Lock,
      gradientClass: "from-[#FFB347] to-[#FF9F2E]",
      title: "No Data Selling",
      description:
        "We never sell or share your personal data with third parties. Your memories belong to you alone.",
    },
    {
      id: "transparency",
      IconPrimary: Eye,
      gradientClass: "from-[#4A90E2] to-[#7EC8E3]",
      primaryClass: "w-10 h-10 text-white",
      accentClass:
        "w-5 h-5 text-white absolute translate-x-3 translate-y-3 opacity-70",
      title: "Full Transparency",
      description:
        "Open-source AI models and transparent data practices. You always know what happens with your data.",
    },
  ];

  return (
    <div>
      <div className="text-center mb-5">
        <p className=" mb-5 text-lg  text-sky-500">
          Your Privacy is Our Priority
        </p>
        <h3 className="text-2xl text-muted-foreground font-semibold">
          We&apos;re committed to keeping your memories safe, secure, and
          completely private
        </h3>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="p-6 bg-card rounded-2xl shadow-sm">
            <IconCard
              IconPrimary={card.IconPrimary}
              gradientClass={card.gradientClass}
              primaryClass={card.primaryClass}
              accentClass={card.accentClass}
            />
            <h4 className="mt-4 text-lg font-medium text-center">
              {card.title}
            </h4>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-muted-foreground">
        Read our full{" "}
        <Link href="/privacy-policy" className="text-sky-500 link">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms-of-service" className="text-sky-500 link">
          Terms of Service
        </Link>
        to learn more about how we protect your digital memories.
      </p>
    </div>
  );
};

export default Privacy;
