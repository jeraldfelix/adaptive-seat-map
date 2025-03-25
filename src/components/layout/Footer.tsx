
import { Github, Mail, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="font-semibold text-xl tracking-tight text-primary">SeatSync</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Smart seat booking for modern workplaces.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Email</span>
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 text-center md:text-left">
          <p className="text-base text-gray-500">
            &copy; {new Date().getFullYear()} SeatSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
