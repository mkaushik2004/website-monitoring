# Website Monitoring Backend

This is the Node.js backend for the website monitoring dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (optional):
```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# CORS Configuration (for production)
FRONTEND_URL=http://localhost:3000

# Monitoring Configuration
MONITORING_INTERVAL=5000
MAX_HISTORY_ENTRIES=1000
REQUEST_TIMEOUT=10000
```

3. Start the server:
```bash
npm run backend
```

## API Endpoints

- `GET /` - Health check
- `GET /websites` - Get all websites
- `POST /websites` - Add a new website
- `DELETE /websites/:id` - Delete a website
- `GET /websites/:id/status` - Get website status
- `GET /websites/:id/history` - Get website history
- `POST /monitor/start` - Start monitoring
- `POST /monitor/stop` - Stop monitoring
- `GET /monitor/status` - Get monitoring status

## Security Features

- CORS is configured for production environments
- SSL certificate verification is enabled in production
- Input validation on all endpoints
- Proper error handling and logging 