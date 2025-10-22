"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Cloud, Folder, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7EC8E3] via-[#4A90E2] to-[#7EC8E3]" />

      {/* Animated Clouds */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-80 h-40 bg-white/30 rounded-full blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-[40%] right-[5%] w-96 h-48 bg-white/25 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <motion.div
        className="absolute bottom-[20%] left-[15%] w-72 h-36 bg-white/35 rounded-full blur-2xl"
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8"
            >
              <div className="space-y-6">
                <h1 className="drop-shadow-lg text-lg">
                  Your Digital Memories, Floating in the Cloud.
                </h1>
                <p className="text-white/95 text-2xl leading-relaxed drop-shadow">
                  Automatically capture, organize, and rediscover your favorite
                  online moments — beautifully stored in your personal memory
                  sky.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/dashboard">
                  <Button className="bg-[#FFB347] hover:bg-[#FF9F2E] text-white px-10 py-7 rounded-full shadow-2xl group cursor-pointer">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>

              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFB347] rounded-full" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFB347] rounded-full" />
                  <span>Free forever</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Glowing Cloud Icon Cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Central glow */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl" />

                {/* Central cloud icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-3xl shadow-2xl flex items-center justify-center"
                >
                  <Cloud className="w-20 h-20 text-[#4A90E2]" />
                  <Brain className="w-12 h-12 text-[#FFB347] absolute translate-x-4 translate-y-4" />
                </motion.div>

                {/* Orbiting icons */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/90 rounded-2xl shadow-xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#FFB347]" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-2xl shadow-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-[#7EC8E3]" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/90 rounded-2xl shadow-xl flex items-center justify-center">
                    <Folder className="w-8 h-8 text-[#4A90E2]" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80"
      >
        <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/80 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
