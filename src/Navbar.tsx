import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import { Link } from "react-router-dom"; // If using React Router

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-primary">
            MyNFTs
          </Link>

          {/* NAV LINKS - DESKTOP */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <Link to="/marketplace" className="hover:text-gray-700">Marketplace</Link>
            <Link to="/wallet" className="hover:text-gray-700">Wallet</Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/marketplace" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Marketplace</Link>
          <Link to="/wallet" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Wallet</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
