import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useWebsites } from '../context/WebsiteContext.jsx';

const AddWebsite = () => {
  const navigate = useNavigate();
  const { addWebsite } = useWebsites();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    url: '',
    check_interval: 60,
    expected_status_code: 200
  });
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Website name is required';
    }
    
    if (!formState.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formState.url);
      } catch (_e) {
        newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }
    
    if (formState.check_interval < 10) {
      newErrors.check_interval = 'Check interval must be at least 10 seconds';
    } else if (formState.check_interval > 3600) {
      newErrors.check_interval = 'Check interval must be at most 3600 seconds (1 hour)';
    }
    
    if (formState.expected_status_code < 100 || formState.expected_status_code > 599) {
      newErrors.expected_status_code = 'Status code must be between 100 and 599';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: name === 'check_interval' || name === 'expected_status_code' 
        ? parseInt(value, 10) || 0
        : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Ensure URL has a protocol
      let url = formState.url;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      
      const website = await addWebsite({
        ...formState,
        url
      });
      
      navigate(`/website/${website.id}`);
    } catch (error) {
      console.error('Failed to add website:', error);
      setErrors({
        ...errors,
        url: 'Failed to add website. Please try again.'
      });
      setIsSubmitting(false);
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
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Add New Website</h1>
          <p className="text-slate-500">
            Enter the details of the website you want to monitor
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-apple p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Website Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.name ? 'border-danger-300' : 'border-slate-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="My Website"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formState.url}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.url ? 'border-danger-300' : 'border-slate-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="https://example.com"
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-danger-600">{errors.url}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  If you don't include "http://" or "https://", we'll add "https://" for you.
                </p>
              </div>
              
              <div>
                <label htmlFor="check_interval" className="block text-sm font-medium text-slate-700 mb-1">
                  Check Interval (seconds)
                </label>
                <input
                  type="number"
                  id="check_interval"
                  name="check_interval"
                  value={formState.check_interval}
                  onChange={handleChange}
                  min="10"
                  max="3600"
                  className={`mt-1 block w-full border ${errors.check_interval ? 'border-danger-300' : 'border-slate-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.check_interval && (
                  <p className="mt-1 text-sm text-danger-600">{errors.check_interval}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  How often the website will be checked. Min: 10 seconds, Max: 3600 seconds (1 hour)
                </p>
              </div>
              
              <div>
                <label htmlFor="expected_status_code" className="block text-sm font-medium text-slate-700 mb-1">
                  Expected Status Code
                </label>
                <input
                  type="number"
                  id="expected_status_code"
                  name="expected_status_code"
                  value={formState.expected_status_code}
                  onChange={handleChange}
                  min="100"
                  max="599"
                  className={`mt-1 block w-full border ${errors.expected_status_code ? 'border-danger-300' : 'border-slate-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.expected_status_code && (
                  <p className="mt-1 text-sm text-danger-600">{errors.expected_status_code}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  The HTTP status code that indicates the website is functioning correctly (usually 200)
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Website...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Website
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWebsite; 