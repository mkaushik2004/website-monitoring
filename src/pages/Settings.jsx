import React, { useState } from 'react';
import { RefreshCw, Play, Pause, ArrowLeft } from 'lucide-react';
import { useWebsites } from '../context/WebsiteContext.jsx';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    monitoringStatus, 
    startMonitoring, 
    stopMonitoring, 
    checkMonitoringStatus 
  } = useWebsites();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkMonitoringStatus();
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };
  
  const handleMonitoringToggle = async () => {
    if (monitoringStatus?.is_monitoring) {
      await stopMonitoring();
    } else {
      await startMonitoring();
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </button>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
          <p className="text-slate-500">
            Configure your monitoring preferences and system settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monitoring Control */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-apple p-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Monitoring Control</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Monitoring Status</p>
                  <p className="text-sm text-slate-500">
                    {monitoringStatus?.is_monitoring 
                      ? `Active - Monitoring ${monitoringStatus.websites_count} websites`
                      : 'Inactive'
                    }
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <button
                onClick={handleMonitoringToggle}
                className={`w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md transition duration-150 ${
                  monitoringStatus?.is_monitoring
                    ? 'bg-danger-500 text-white hover:bg-danger-600'
                    : 'bg-success-500 text-white hover:bg-success-600'
                }`}
              >
                {monitoringStatus?.is_monitoring ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Monitoring
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Monitoring
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* System Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-apple p-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">System Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Last Updated</span>
                <span className="font-medium">
                  {monitoringStatus?.start_time 
                    ? new Date(monitoringStatus.start_time).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Total Websites</span>
                <span className="font-medium">{monitoringStatus?.websites_count || 0}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  monitoringStatus?.is_monitoring
                    ? 'bg-success-100 text-success-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {monitoringStatus?.is_monitoring ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Settings */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-apple p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Additional Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Data Retention</p>
                <p className="text-sm text-slate-500">
                  Historical data is automatically limited to the last 1000 entries per website
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Check Intervals</p>
                <p className="text-sm text-slate-500">
                  Minimum: 10 seconds, Maximum: 3600 seconds (1 hour)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Timeout Settings</p>
                <p className="text-sm text-slate-500">
                  Website checks timeout after 10 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 