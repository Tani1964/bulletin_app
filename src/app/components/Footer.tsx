import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 mr-3 flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="NBBCI Logo" width={32} height={32} />
            </div>
            <h4 className="text-lg sm:text-xl font-bold">NBBCI</h4>
          </div>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            New Birth Baptist Church Ikorodu
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <span className="text-gray-300">
              © 2025 NBBCI. All rights reserved.
            </span>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
