"use client";

import { motion } from "framer-motion";
import { Brain, Cloud, Sparkles } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
const data = [
  {
    id: "encryption",
    IconPrimary: Sparkles,
    gradientClass: "from-[#FFB347] to-[#FF9F2E]",
    badgeLabel: "Inspiring",
  },
  {
    id: "no-selling",
    IconPrimary: Cloud,
    gradientClass: "from-[#4A90E2] to-[#7EC8E3]",
    badgeLabel: "Calm",
  },
  {
    id: "transparency",
    IconPrimary: Brain,
    gradientClass: "from-[#7EC8E3] to-[#DDE4EC]",
    primaryClass: "w-12 h-12 text-white/80",
    badgeLabel: "Thoughtful",
  },
];

const Preview = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#F6F9FC] via-[#DDE4EC] to-[#F6F9FC] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#7EC8E3]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB347]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sky-500 mb-4 text-lg">
            See Your Content Organized Like Never Before
          </p>
          <h2 className="text-2xl text-muted-foreground font-semibold">
            Every memory beautifully displayed with smart tags and emotions
          </h2>
        </motion.div>

        {/* Mock Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60">
            {/* Mock Navigation */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7EC8E3] to-[#4A90E2] flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-[#4A90E2]">Sparky</span>
              </div>
              <div className="flex gap-2">
                <div className="w-32 h-8 bg-gray-200/50 rounded-full" />
                <div className="w-8 h-8 bg-gray-200/50 rounded-full" />
              </div>
            </div>

            {/* Mock Memory Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {data.map((card, index) => {
                const Icon = card.IconPrimary;
                const delay = 0.2 + index * 0.1;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
                  >
                    <div
                      className={`h-32 bg-gradient-to-br ${card.gradientClass} flex items-center justify-center relative`}
                    >
                      <Icon
                        className={
                          card.primaryClass ?? "w-12 h-12 text-white/80"
                        }
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${card.gradientClass
                          .split(" ")[0]
                          .replace("from-", "bg-")} border-0 text-white`}
                      >
                        {card.badgeLabel}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Preview;
