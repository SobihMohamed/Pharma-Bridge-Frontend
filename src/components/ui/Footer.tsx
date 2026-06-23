import { Link } from 'react-router-dom';
import { Pill, Activity, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-teal-600 mb-2">
              <Pill className="h-6 w-6" />
              <span className="text-xl font-bold">PharmaBridge</span>
            </div>
            <p className="text-gray-500 text-sm">
              Connecting patients with the best pharmacies.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/about" className="hover:text-teal-600 transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-teal-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-teal-600 transition-colors">Terms of Service</Link>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-teal-600 transition-colors" aria-label="Health Activity">
              <Activity className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-teal-600 transition-colors" aria-label="Contact">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center text-gray-400 text-sm mt-8 pt-4 border-t border-gray-100">
          &copy; {currentYear} PharmaBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
