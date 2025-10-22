import React from "react";
import Logo from "../Common/Logo";
import SearchBar from "./SearchBar";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 min-w-fit">
          <Logo />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sparky
          </h3>
        </div>

        {/* Search Bar - Centered and Responsive */}
        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
