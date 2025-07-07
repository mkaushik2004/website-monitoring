import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Trash2, RefreshCw, Clock, ArrowLeft } from 'lucide-react';
import { useWebsites } from '../context/WebsiteContext.jsx';
import PerformanceChart from '../components/PerformanceChart.jsx';
import StatusIndicator from '../components/StatusIndicator.jsx';
import { format, parseISO } from 'date-fns';

const WebsiteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { websites, deleteWebsite, getWebsiteHistory } = useWebsites();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const website = websites.find(site => site.id === id);
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (id) {
        setIsLoading(true);
        const data = await getWebsiteHistory(id, 100);
        setHistory(data);
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [id, getWebsiteHistory]);
  
  const handleRefresh = async () => {
    if (id) {
      setIsLoading(true);
      const data = await getWebsiteHistory(id, 100);
      setHistory(data);
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (id) {
      setIsDeleting(true);
      const success = await deleteWebsite(id);
      if (success) {
        navigate('/');
      } else {
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    }
  };

  if (!website) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-800 mb-2">Website not found</h3>
        <p className="text-slate-500 mb-6">
          The website you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg shadow-sm hover:bg-primary-600 transition duration-150"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getFormattedURL = (url) => {
    try {
      return new URL(url).toString();
    } catch (_e) {
      return url;
    }
  };
  
  const getLastCheckTime = () => {
    if (!website.last_check) return 'Never checked';
    try {
      return format(parseISO(website.last_check), 'PPpp');
    } catch (_e) {
      return 'Unknown';
    }
  };
  
  const getStatusClass = () => {
    switch (website.status) {
      case 'up':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'down':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      default:
        return 'bg-warning-50 border-warning-200 text-warning-800';
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{website.name}</h1>
            <div className="flex items-center mt-1">
              <a 
                href={website.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 flex items-center hover:underline"
              >
                {getFormattedURL(website.url)}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition duration-150"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-3 py-2 border border-danger-300 text-sm font-medium rounded-md text-danger-700 bg-danger-50 hover:bg-danger-100 transition duration-150"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Website
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`rounded-xl p-6 border ${getStatusClass()}`}>
          <h3 className="font-medium mb-4">Status</h3>
          <div className="flex items-center space-x-2">
            <StatusIndicator status={website.status || 'unknown'} />
            <span className="text-lg font-medium">
              {website.status === 'up' ? 'Online' : website.status === 'down' ? 'Offline' : 'Unknown'}
            </span>
          </div>
          <div className="text-sm mt-2 opacity-80">
            Status Code: {website.status_code || 'N/A'}
          </div>
        </div>
        
        <div className="rounded-xl p-6 bg-white border border-slate-200 shadow-apple">
          <h3 className="font-medium text-slate-700 mb-4">Response Time</h3>
          <div className="flex items-center">
            <div className="text-2xl font-medium text-slate-800">
              {website.response_time ? `${website.response_time}ms` : 'N/A'}
            </div>
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {history.length > 0 ? (
              <>Average: {Math.round(history.reduce((acc, curr) => acc + curr.response_time, 0) / history.length)}ms</>
            ) : (
              'No data available'
            )}
          </div>
        </div>
        
        <div className="rounded-xl p-6 bg-white border border-slate-200 shadow-apple">
          <h3 className="font-medium text-slate-700 mb-4">Monitoring</h3>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-slate-400 mr-2" />
            <div className="text-slate-800">
              Interval: {website.check_interval} seconds
            </div>
          </div>
          <div className="text-sm text-slate-500 mt-2">
            Last checked: {getLastCheckTime()}
          </div>
        </div>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {isLoading ? (
          <>
            <div className="bg-white rounded-xl p-4 shadow-apple animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-4 w-1/4"></div>
              <div className="h-64 bg-slate-100 rounded"></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-apple animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-4 w-1/4"></div>
              <div className="h-64 bg-slate-100 rounded"></div>
            </div>
          </>
        ) : history.length > 0 ? (
          <>
            <PerformanceChart
              data={history}
              metricKey="response_time"
              color="#0A84FF"
              label="Response Time (ms)"
            />
            <PerformanceChart
              data={history}
              metricKey="status_code"
              color="#30D158"
              label="Status Code"
            />
          </>
        ) : (
          <div className="col-span-2 bg-white rounded-xl p-6 text-center shadow-apple">
            <h3 className="font-medium text-slate-700 mb-2">No monitoring data available</h3>
            <p className="text-slate-500">
              We haven't collected any monitoring data for this website yet. Data will appear here once monitoring begins.
            </p>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-apple overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-medium text-slate-700">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 bg-slate-100 rounded w-full"></div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Response Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {history.slice(0, 10).map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {format(parseISO(entry.timestamp), 'PP p')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={entry.is_up ? 'up' : 'down'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {entry.status_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {entry.response_time}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-slate-500">
              No activity data available
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Delete Website</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{website.name}"? This action cannot be undone and will remove all monitoring data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition duration-150"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-danger-500 hover:bg-danger-600 transition duration-150"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteDetail; 