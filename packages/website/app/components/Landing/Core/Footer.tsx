"use client";
import React from "react";
import IconCard from "../Others/icons";
import { Brain, Cloud } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import Logo from "../../Common/Logo";

const Footer = () => {
  return (
     <footer className="bg-gradient-to-r from-[#7EC8E3] via-[#4A90E2] to-[#7EC8E3] py-12 relative overflow-hidden">
        {/* Small floating cloud */}
        <motion.div
          className="absolute top-1/2 right-20 text-4xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ☁️
        </motion.div>
        
        <div className="container mx-auto px-30 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white">
            {/* Left - Logo and Tagline */}
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <div className="flex items-center gap-2">
                  <span className="drop-shadow">Sparky</span>
                </div>
                <p className="text-white/80 text-sm">Powered by AI Memories</p>
              </div>
            </div>
            
            {/* Right - Links */}
            <div className="flex gap-8 text-white/90">
              <a href="#" className="hover:text-white transition-colors drop-shadow">
                About
              </a>
              <span className="text-white/50">•</span>
              <a href="#" className="hover:text-white transition-colors drop-shadow">
                Privacy
              </a>
              <span className="text-white/50">•</span>
              <a href="#" className="hover:text-white transition-colors drop-shadow">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/30 text-center text-white/80">
            <p className="drop-shadow">© 2025 Sparky. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
