import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https'; // at the top of the file

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'http://localhost:3000'] 
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

let websites = {};
let history = {};
let isMonitoring = false;
let monitoringInterval;
let startTime = null;

const DATA_FILE = path.join(__dirname, 'websites_data.json');

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    websites = parsed.websites || {};
    history = parsed.history || {};
    console.log('Data loaded successfully');
  } catch (_error) {
    console.log('No existing data found, starting fresh');
  }
}

async function saveData() {
  try {
    const dataToSave = {
      websites,
      history: Object.fromEntries(
        Object.entries(history).map(([key, value]) => [key, value.slice(-100)])
      )
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

async function checkWebsite(websiteId) {
  const website = websites[websiteId];
  if (!website) return null;

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // Only disable SSL verification in development
    const agent = process.env.NODE_ENV === 'development' 
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    const response = await fetch(website.url, {
      signal: controller.signal,
      ...(agent && { agent }),
      headers: {
        'User-Agent': 'WebMonitor/1.0'
      }
    });

    clearTimeout(timeoutId);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const isUp = response.status === website.expected_status_code;

    const result = {
      website_id: websiteId,
      url: website.url,
      timestamp: new Date().toISOString(),
      response_time: responseTime,
      status_code: response.status,
      is_up: isUp
    };

    if (!history[websiteId]) {
      history[websiteId] = [];
    }
    history[websiteId].push(result);

    if (history[websiteId].length > 1000) {
      history[websiteId] = history[websiteId].slice(-1000);
    }

    websites[websiteId].last_check = result.timestamp;
    websites[websiteId].status = isUp ? 'up' : 'down';
    websites[websiteId].response_time = responseTime;
    websites[websiteId].status_code = response.status;

    await saveData();
    return result;
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log the error for debugging
    console.error(`Error checking website ${websiteId} (${website.url}):`, error.message);

    const result = {
      website_id: websiteId,
      url: website.url,
      timestamp: new Date().toISOString(),
      response_time: responseTime,
      status_code: 0,
      is_up: false,
      error: error.message
    };

    if (!history[websiteId]) {
      history[websiteId] = [];
    }
    history[websiteId].push(result);

    if (history[websiteId].length > 1000) {
      history[websiteId] = history[websiteId].slice(-1000);
    }

    websites[websiteId].last_check = result.timestamp;
    websites[websiteId].status = 'down';
    websites[websiteId].response_time = responseTime;
    websites[websiteId].status_code = 0;

    await saveData();
    return result;
  }
}

async function monitorWebsites() {
  for (const websiteId of Object.keys(websites)) {
    const website = websites[websiteId];
    const lastCheck = website.last_check;
    const currentTime = Date.now();

    if (!lastCheck || (new Date(lastCheck).getTime() + website.check_interval * 1000) <= currentTime) {
      try {
        await checkWebsite(websiteId);
      } catch (error) {
        console.error(`Error checking website ${websiteId} (${website.url}):`, error);
        
        // Update website status to reflect the error
        websites[websiteId].last_check = new Date().toISOString();
        websites[websiteId].status = 'down';
        websites[websiteId].response_time = 0;
        websites[websiteId].status_code = 0;
        
        // Save the error state
        await saveData();
      }
    }
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Website Monitoring API', status: 'running' });
});

app.get('/websites', (req, res) => {
  res.json(Object.values(websites));
});

app.post('/websites', async (req, res) => {
  try {
    // Input validation
    const { name, url, check_interval, expected_status_code } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ 
        error: 'Name and URL are required fields' 
      });
    }
    
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Name must be a non-empty string' 
      });
    }
    
    if (typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ 
        error: 'URL must be a non-empty string' 
      });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (_urlError) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }
    
    // Validate check_interval
    const interval = check_interval || 60;
    if (typeof interval !== 'number' || interval < 10 || interval > 3600) {
      return res.status(400).json({ 
        error: 'Check interval must be between 10 and 3600 seconds' 
      });
    }
    
    // Validate expected_status_code
    const statusCode = expected_status_code || 200;
    if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
      return res.status(400).json({ 
        error: 'Expected status code must be between 100 and 599' 
      });
    }

    const websiteId = uuidv4();
    const website = {
      id: websiteId,
      name: name.trim(),
      url: url.trim(),
      check_interval: interval,
      expected_status_code: statusCode,
      last_check: null,
      status: 'unknown'
    };

    websites[websiteId] = website;
    await saveData();
    res.json(website);
  } catch (error) {
    console.error('Error adding website:', error);
    res.status(500).json({ error: 'Failed to add website' });
  }
});

app.delete('/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (websites[id]) {
      delete websites[id];
      delete history[id];
      await saveData();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Website not found' });
    }
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
});

app.get('/websites/:id/status', (req, res) => {
  const { id } = req.params;
  const website = websites[id];
  if (website) {
    res.json(website);
  } else {
    res.status(404).json({ error: 'Website not found' });
  }
});

app.get('/websites/:id/history', (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  const websiteHistory = history[id];
  if (websiteHistory) {
    res.json(websiteHistory.slice(-limit));
  } else {
    res.status(404).json({ error: 'Website not found' });
  }
});

app.post('/monitor/start', (req, res) => {
  if (!isMonitoring) {
    isMonitoring = true;
    startTime = new Date();
    monitoringInterval = setInterval(monitorWebsites, 5000); // Check every 5 seconds
    console.log('Monitoring started');
  }
  res.json({ status: 'Monitoring started' });
});

app.post('/monitor/stop', (req, res) => {
  if (isMonitoring) {
    isMonitoring = false;
    startTime = null;
    clearInterval(monitoringInterval);
    console.log('Monitoring stopped');
  }
  res.json({ status: 'Monitoring stopped' });
});

app.get('/monitor/status', (req, res) => {
  res.json({
    is_monitoring: isMonitoring,
    websites_count: Object.keys(websites).length,
    start_time: startTime ? startTime.toISOString() : null
  });
});

// Error handling middleware
app.use((error, req, res, _next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Load data and start server
loadData().then(() => {
  app.listen(port, () => {
    console.log(`✅ Website Monitoring API running at http://localhost:${port}`);
    console.log(`📊 Loaded ${Object.keys(websites).length} websites`);
    console.log(`📈 Historical data for ${Object.keys(history).length} websites`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});