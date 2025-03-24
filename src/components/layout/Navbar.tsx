
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MOCK_CURRENT_USER } from '../../utils/mockData';
import { Menu, X, UserCircle2, LogOut, Settings, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <span className="font-semibold text-xl tracking-tight text-primary">SeatSync</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            <NavLink 
              to="/"
              className={({isActive}) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/dashboard"
              className={({isActive}) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/select-seat"
              className={({isActive}) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Select Seat
            </NavLink>
            <NavLink 
              to="/admin"
              className={({isActive}) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Admin
            </NavLink>
          </nav>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                  <img
                    src={MOCK_CURRENT_USER.profileImage}
                    alt={MOCK_CURRENT_USER.name}
                    className="w-8 h-8 rounded-full border border-slate-200"
                  />
                  <span>{MOCK_CURRENT_USER.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
          <div className="pt-2 pb-4 space-y-1 px-4">
            <NavLink 
              to="/"
              className={`block py-2 px-4 rounded-md ${
                location.pathname === '/' ? 'bg-primary/10 text-primary' : 'text-gray-700'
              }`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink 
              to="/dashboard"
              className={`block py-2 px-4 rounded-md ${
                location.pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-700'
              }`}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/select-seat"
              className={`block py-2 px-4 rounded-md ${
                location.pathname === '/select-seat' ? 'bg-primary/10 text-primary' : 'text-gray-700'
              }`}
              onClick={closeMenu}
            >
              Select Seat
            </NavLink>
            <NavLink 
              to="/admin"
              className={`block py-2 px-4 rounded-md ${
                location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-gray-700'
              }`}
              onClick={closeMenu}
            >
              Admin
            </NavLink>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center px-4 py-2">
                <img
                  src={MOCK_CURRENT_USER.profileImage}
                  alt={MOCK_CURRENT_USER.name}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{MOCK_CURRENT_USER.name}</div>
                  <div className="text-xs text-gray-500">{MOCK_CURRENT_USER.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-4">
                <button className="flex items-center w-full py-2 text-gray-700">
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </button>
                <button className="flex items-center w-full py-2 text-gray-700">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </button>
                <button className="flex items-center w-full py-2 text-gray-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
