import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pill, Bell, Menu, X, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { i18n } = useTranslation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    clearAuth();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Requests', path: '/requests' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Complaints', path: '/complaints' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
            <Pill className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">PharmaBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse mx-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-teal-600 ${
                    isActive ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : 'text-gray-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
            >
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 end-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="bg-teal-100 p-1.5 rounded-full text-teal-700">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium hidden lg:block">My Account</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 me-2 text-gray-400" />
                    Profile
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 me-2 text-gray-400" />
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 me-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 end-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 pb-2">
            <div className="flex items-center px-3 mb-4">
              <div className="bg-teal-100 p-2 rounded-full text-teal-700 me-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-medium text-gray-800">My Account</div>
              </div>
            </div>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-start px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
            >
              Language: {i18n.language === 'ar' ? 'English' : 'عربي'}
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-start px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-2"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
