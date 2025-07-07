import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DashboardSummary = ({ websites }) => {
  const stats = websites.reduce((acc, website) => {
    switch (website.status) {
      case 'up':
        acc.up++;
        break;
      case 'down':
        acc.down++;
        break;
      default:
        acc.unknown++;
        break;
    }
    return acc;
  }, { up: 0, down: 0, unknown: 0 });

  const total = websites.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-apple">
        <div className="flex items-center">
          <div className="p-2 bg-success-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-success-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Online</p>
            <p className="text-2xl font-bold text-slate-900">{stats.up}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-apple">
        <div className="flex items-center">
          <div className="p-2 bg-danger-50 rounded-lg">
            <XCircle className="h-6 w-6 text-danger-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Offline</p>
            <p className="text-2xl font-bold text-slate-900">{stats.down}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-apple">
        <div className="flex items-center">
          <div className="p-2 bg-warning-50 rounded-lg">
            <AlertCircle className="h-6 w-6 text-warning-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Total</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary; 