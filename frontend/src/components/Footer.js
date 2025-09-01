import React from 'react';
import { Mail, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Email Analyzer</span>
            </div>
            <p className="text-gray-600 text-sm">
              Professional email analysis tool that identifies receiving chains and ESP types using IMAP technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/emails" className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Email List
                </a>
              </li>
              <li>
                <a href="/test-info" className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Test Instructions
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Features</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                IMAP Email Processing
              </li>
              <li className="text-sm text-gray-600">
                Receiving Chain Analysis
              </li>
              <li className="text-sm text-gray-600">
                ESP Type Detection
              </li>
              <li className="text-sm text-gray-600">
                Real-time Monitoring
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2024 Email Analyzer. Built with React, Node.js, and NestJS.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://toolbox.googleapps.com/apps/messageheader/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <span className="text-sm">Google Header Tool</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
