import React from 'react';
import { ExternalLink, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import StatusIndicator from './StatusIndicator.jsx';

const WebsiteCard = ({ website }) => {
  const getStatusClass = () => {
    switch (website.status) {
      case 'up':
        return 'bg-success-50 border-success-200';
      case 'down':
        return 'bg-danger-50 border-danger-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getFormattedURL = (url) => {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (_e) {
      return url;
    }
  };

  const getLastCheckTime = () => {
    if (!website.last_check) return 'Never checked';
    try {
      return formatDistanceToNow(new Date(website.last_check), { addSuffix: true });
    } catch (_e) {
      return 'Unknown';
    }
  };

  return (
    <Link
      to={`/website/${website.id}`}
      className={`block transition-all duration-200 rounded-xl border ${getStatusClass()} shadow-apple hover:shadow-apple-md`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-slate-800 truncate">{website.name}</h3>
          <StatusIndicator status={website.status || 'unknown'} />
        </div>
        
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <ExternalLink className="w-4 h-4 mr-1" />
          <span className="truncate">{getFormattedURL(website.url)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white p-2 border border-slate-100">
            <div className="flex items-center text-slate-500 mb-1">
              <Clock className="w-3 h-3 mr-1" />
              <span>Response</span>
            </div>
            <div className="font-medium">
              {website.response_time ? `${website.response_time}ms` : 'N/A'}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-2 border border-slate-100">
            <div className="flex items-center text-slate-500 mb-1">
              {website.status === 'up' ? (
                <ArrowUp className="w-3 h-3 mr-1 text-success-500" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1 text-danger-500" />
              )}
              <span>Status</span>
            </div>
            <div className="font-medium">
              {website.status_code || 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-400">
            <Clock className="w-3 h-3 mr-1" />
            <span>Checked: {getLastCheckTime()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WebsiteCard; 