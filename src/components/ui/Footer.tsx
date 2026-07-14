import { Link } from 'react-router-dom';
import { Activity, Mail } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto dark:bg-[#0f172a] dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-teal-600 dark:text-sky-400 mb-2">
              <img src={logo} alt="PharmaBridge Logo" className="h-8 w-8 object-contain rounded-full shadow-sm" />
              <span className="text-xl font-bold dark:text-white">PharmaBridge</span>
            </div>
            <p className="text-gray-500 text-sm dark:text-slate-400">
              Connecting patients with the best pharmacies.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
            <Link to="/about" className="hover:text-teal-600 dark:hover:text-sky-400 transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-teal-600 dark:hover:text-sky-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-teal-600 dark:hover:text-sky-400 transition-colors">Terms of Service</Link>
          </div>

          <div className="flex items-center gap-4 text-gray-400 dark:text-slate-500">
            <a href="#" className="hover:text-teal-600 dark:hover:text-sky-400 transition-colors" aria-label="Health Activity">
              <Activity className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-sky-400 transition-colors" aria-label="Contact">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center text-gray-400 dark:text-slate-500 text-sm mt-8 pt-4 border-t border-gray-100 dark:border-slate-800">
          &copy; {currentYear} PharmaBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
