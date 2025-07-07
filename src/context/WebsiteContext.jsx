import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const WebsiteContext = createContext(undefined);

export const useWebsites = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsites must be used within a WebsiteProvider');
  }
  return context;
};

export const WebsiteProvider = ({ children }) => {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monitoringStatus, setMonitoringStatus] = useState(null);

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/websites');
      setWebsites(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch websites');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addWebsite = async (website) => {
    try {
      const response = await api.post('/websites', website);
      const newWebsite = response.data;
      setWebsites(prev => [...prev, newWebsite]);
      return newWebsite;
    } catch (err) {
      setError('Failed to add website');
      console.error(err);
      throw err;
    }
  };

  const deleteWebsite = async (id) => {
    try {
      await api.delete(`/websites/${id}`);
      setWebsites(prev => prev.filter(website => website.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete website');
      console.error(err);
      return false;
    }
  };

  const getWebsiteHistory = async (id, limit = 100) => {
    try {
      const response = await api.get(`/websites/${id}/history?limit=${limit}`);
      return response.data;
    } catch (err) {
      setError('Failed to get website history');
      console.error(err);
      return [];
    }
  };

  const startMonitoring = async () => {
    try {
      await api.post('/monitor/start');
      await checkMonitoringStatus();
    } catch (err) {
      setError('Failed to start monitoring');
      console.error(err);
    }
  };

  const stopMonitoring = async () => {
    try {
      await api.post('/monitor/stop');
      await checkMonitoringStatus();
    } catch (err) {
      setError('Failed to stop monitoring');
      console.error(err);
    }
  };

  const checkMonitoringStatus = async () => {
    try {
      const response = await api.get('/monitor/status');
      setMonitoringStatus(response.data);
    } catch (err) {
      console.error('Failed to get monitoring status:', err);
      // Don't set error state here to avoid UI disruption during polling
    }
  };

  useEffect(() => {
    fetchWebsites();
    checkMonitoringStatus();
    
    // Polling to refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchWebsites();
      checkMonitoringStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <WebsiteContext.Provider
      value={{
        websites,
        isLoading,
        error,
        monitoringStatus,
        fetchWebsites,
        addWebsite,
        deleteWebsite,
        getWebsiteHistory,
        startMonitoring,
        stopMonitoring,
        checkMonitoringStatus,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
}; 