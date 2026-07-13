import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Pill, Menu, X, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { NotificationBell } from '@/shared/ui/Notifications/NotificationBell';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 md:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#006591]">
            <Pill className="h-8 w-8 fill-[#006591] text-[#006591] transform -rotate-45" />
            <span className="text-2xl font-bold tracking-tight text-[#006591]">PharmaBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 hover:text-[#006591] ${
                    isActive 
                      ? 'text-[#006591] border-b-2 border-[#006591] pb-1' 
                      : 'text-gray-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#009ADA] transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#009ADA] hover:bg-[#007ba6] rounded-full shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                {/* Notifications */}
                <div className="flex items-center">
                  <NotificationBell />
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <User className="h-5 w-5 text-[#006591]" />
                    <span className="text-sm font-semibold text-gray-900 hidden lg:inline">My Account</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Profile
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center mr-2">
                <NotificationBell />
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-[#009ADA] hover:bg-gray-100 focus:outline-none"
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
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#009ADA] hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 pb-2">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-3 mt-2 px-3">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2.5 text-base font-bold text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2.5 text-base font-bold text-white bg-[#009ADA] hover:bg-[#007ba6] rounded-lg shadow-sm transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center px-3 mb-4">
                  <div className="bg-[#006591]/10 p-2 rounded-full text-[#006591] mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-800">My Account</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#009ADA] hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-2"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
