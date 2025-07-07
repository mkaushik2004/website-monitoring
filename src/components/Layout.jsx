import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, Home, Settings, Plus, Menu, X } from 'lucide-react';
import { useWebsites } from '../context/WebsiteContext.jsx';
import StatusIndicator from './StatusIndicator.jsx';

const Layout = () => {
  const { monitoringStatus } = useWebsites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-semibold text-slate-800">WebMonitor</h1>
          </div>
          
          {monitoringStatus && (
            <div className="mt-4 p-2 bg-slate-50 rounded-md flex items-center">
              <StatusIndicator status={monitoringStatus.is_monitoring ? 'active' : 'inactive'} />
              <span className="ml-2 text-sm text-slate-600">
                {monitoringStatus.is_monitoring 
                  ? `Monitoring ${monitoringStatus.websites_count} websites` 
                  : 'Monitoring inactive'}
              </span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/add-website" 
            className={({isActive}) => 
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Plus className="mr-3 h-5 w-5" />
            <span>Add Website</span>
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({isActive}) => 
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary-500" />
              <h1 className="text-xl font-semibold text-slate-800">WebMonitor</h1>
            </div>
            
            <button
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="mt-4 space-y-1">
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={closeMobileMenu}
              >
                <Home className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/add-website" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={closeMobileMenu}
              >
                <Plus className="mr-3 h-5 w-5" />
                <span>Add Website</span>
              </NavLink>
              
              <NavLink 
                to="/settings" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={closeMobileMenu}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </NavLink>
            </nav>
          )}
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 