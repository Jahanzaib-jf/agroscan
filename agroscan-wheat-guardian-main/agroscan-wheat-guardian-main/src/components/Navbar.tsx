
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-agro-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-agro-primary text-xl font-bold">AgroScan</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-agro-primary px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-agro-primary px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link to="/results" className="text-gray-700 hover:text-agro-primary px-3 py-2 text-sm font-medium">
                Results
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-agro-primary px-3 py-2 text-sm font-medium">
                About Us
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-agro-primary px-3 py-2 text-sm font-medium">
                How It Works
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-agro-primary px-3 py-2 text-sm font-medium">
                Contact Us
              </Link>
            </nav>
          )}

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-1">
            <Button 
              asChild 
              variant="outline" 
              className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
            >
              <Link to="/admin">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-agro-dark">
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && isMobile && (
        <nav className="md:hidden bg-white border-t border-gray-200 py-2 px-4 space-y-1 animate-fade-in">
          <Link to="/" className="block text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/services" className="block text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            Services
          </Link>
          <Link to="/results" className="block text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            Results
          </Link>
          <Link to="/about" className="block text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            About Us
          </Link>
          <Link to="/how-it-works" className="block text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            How It Works
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            Contact Us
          </Link>
          <Link to="/admin" className="block text-agro-primary hover:bg-gray-100 px-3 py-3 rounded-md" onClick={toggleMenu}>
            Admin Login
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
