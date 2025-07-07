import React from 'react';

const StatusIndicator = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'up':
        return {
          color: 'bg-success-500',
          text: 'Online',
          icon: '●'
        };
      case 'down':
        return {
          color: 'bg-danger-500',
          text: 'Offline',
          icon: '●'
        };
      case 'active':
        return {
          color: 'bg-success-500',
          text: 'Active',
          icon: '●'
        };
      case 'inactive':
        return {
          color: 'bg-slate-400',
          text: 'Inactive',
          icon: '●'
        };
      default:
        return {
          color: 'bg-warning-500',
          text: 'Unknown',
          icon: '●'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
      <span className="text-sm font-medium text-slate-700">{config.text}</span>
    </div>
  );
};

export default StatusIndicator; 