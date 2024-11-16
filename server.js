const express = require('express');
const app = express();

// Add JSON and URL-encoded body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add basic auth middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  
  if (!auth || auth.indexOf('Basic ') === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bolt Server"');
    return res.status(401).send('Authentication required');
  }

  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  const username = credentials[0];
  const password = credentials[1];

  if (username === process.env.BOLT_USERNAME && password === process.env.BOLT_PASSWORD) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bolt Server"');
    return res.status(401).send('Invalid credentials');
  }
};

// Serve the main page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bolt App Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .status-card {
            background-color: #e8f5e9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .status-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .button:hover {
            background-color: #45a049;
          }
          .status-label {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            background-color: #4CAF50;
            color: white;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bolt Server Dashboard</h1>
            <span class="status-label">✅ Active</span>
          </div>
          
          <div class="status-card">
            <h2>System Status</h2>
            <div class="status-item">
              <strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}
            </div>
            <div class="status-item">
              <strong>Port:</strong> ${process.env.PORT || 3000}
            </div>
            <div class="status-item">
              <strong>Current User:</strong> ${process.env.BOLT_USERNAME}
            </div>
            <div class="status-item">
              <strong>Server Time:</strong> ${new Date().toLocaleString()}
            </div>
          </div>

          <div class="status-card">
            <h2>API Endpoints</h2>
            <div class="status-item">
              <strong>GET /api/status</strong> - Server Status
            </div>
            <div class="status-item">
              <strong>GET /api/health</strong> - Health Check
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Add API endpoints
app.get('/api/status', basicAuth, (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    user: process.env.BOLT_USERNAME
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
