import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Play, Pause } from 'lucide-react';
import { useWebsites } from '../context/WebsiteContext.jsx';
import WebsiteCard from '../components/WebsiteCard.jsx';
import DashboardSummary from '../components/DashboardSummary.jsx';

const Dashboard = () => {
  const { websites, isLoading, error, fetchWebsites, monitoringStatus, startMonitoring, stopMonitoring } = useWebsites();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWebsites();
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };

  const handleMonitoringToggle = async () => {
    if (monitoringStatus?.is_monitoring) {
      await stopMonitoring();
    } else {
      await startMonitoring();
    }
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
        <Plus className="h-8 w-8 text-primary-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">No websites yet</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        Add your first website to start monitoring its performance and availability.
      </p>
      <Link
        to="/add-website"
        className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg shadow-sm hover:bg-primary-600 transition duration-150"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Website
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">
            Monitor your websites' performance and availability
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition duration-150 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleMonitoringToggle}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition duration-150 ${
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <DashboardSummary websites={websites} />

      {/* Websites Grid */}
      {websites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 