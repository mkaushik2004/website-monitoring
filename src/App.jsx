import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import WebsiteDetail from './pages/WebsiteDetail.jsx';
import Settings from './pages/Settings.jsx';
import AddWebsite from './pages/AddWebsite.jsx';
import { WebsiteProvider } from './context/WebsiteContext.jsx';

function App() {
  return (
    <WebsiteProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="website/:id" element={<WebsiteDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="add-website" element={<AddWebsite />} />
          </Route>
        </Routes>
      </Router>
    </WebsiteProvider>
  );
}

export default App; 