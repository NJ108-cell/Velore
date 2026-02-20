import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Car, MapPin, Bell, User, Menu, X, 
  Home, BookOpen, Award, MessageCircle, Settings, LogOut
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ user, location, onMenuToggle, menuOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">VehicleLearn</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Global Training Platform</p>
            </div>
          </Link>

          {/* Center Nav - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to={createPageUrl('Learning')}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <BookOpen className="w-4 h-4 mr-2" />
                Learn
              </Button>
            </Link>
            <Link to={createPageUrl('Certifications')}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Award className="w-4 h-4 mr-2" />
                Certifications
              </Button>
            </Link>
            <Link to={createPageUrl('AIAssistant')}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Guide
              </Button>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Location Badge */}
            {location?.country && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-full"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-medium text-sky-700">
                  {location.state ? `${location.state}, ` : ''}{location.country}
                </span>
              </motion.div>
            )}

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => alert('Notifications feature coming soon!')}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {user?.full_name?.[0] || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-gray-900">{user?.full_name || 'User'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <Link to={createPageUrl('Profile')}>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link to={createPageUrl('Settings')}>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    if (confirm('Are you sure you want to logout?')) {
                      await base44.auth.logout();
                    }
                  }}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={onMenuToggle}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-white border-t border-gray-100"
      >
        <nav className="p-4 space-y-2">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <Home className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Home</span>
          </Link>
          <Link to={createPageUrl('Learning')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Learn</span>
          </Link>
          <Link to={createPageUrl('Certifications')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <Award className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Certifications</span>
          </Link>
          <Link to={createPageUrl('AIAssistant')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">AI Guide</span>
          </Link>
        </nav>
      </motion.div>
    </header>
  );
}