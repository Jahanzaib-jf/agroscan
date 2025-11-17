
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-agro-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo and About */}
          <div>
            <h2 className="text-xl font-bold mb-4">AgroScan</h2>
            <p className="text-sm text-gray-200 mb-4">
              AI-driven crop disease diagnosis tool that classifies wheat rust severity and highlights infected regions in wheat leaves.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-200 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-gray-200 hover:text-white">
                  Results
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-200 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>contact@agroscan.com</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span>+92 (335) 1234567</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>Dept. of Computer Engineering, Bahria University Islamabad</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            © {currentYear} AgroScan. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="#" className="text-gray-300 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-300 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
