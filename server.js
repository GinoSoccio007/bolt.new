const express = require('express');
const app = express();

// Enhanced middleware
app.use(express.json());
app.use(express.static('public'));

// Memory store for apps (temporary - we'll add database later)
const apps = [];

// API Routes
app.post('/api/apps', (req, res) => {
  const { name, description } = req.body;
  const newApp = {
    id: Date.now(),
    name,
    description,
    created: new Date(),
    status: 'active'
  };
  apps.push(newApp);
  res.json(newApp);
});

app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// Enhanced main route with app creation UI
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bolt Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f2f5;
            color: #333;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          button {
            background: #0066ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background: #0052cc;
          }
          .app-list {
            margin-top: 20px;
          }
          .status {
            padding: 8px;
            background: #e8f5e9;
            border-radius: 4px;
            margin-bottom: 10px;
          }
        </style>
        <script>
          async function createApp() {
            const name = document.getElementById('appName').value;
            const description = document.getElementById('appDescription').value;
            
            const response = await fetch('/api/apps', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, description })
            });
            
            const app = await response.json();
            updateAppsList();
            document.getElementById('appForm').reset();
          }

          async function updateAppsList() {
            const response = await fetch('/api/apps');
            const apps = await response.json();
            
            const appsList = document.getElementById('appsList');
            appsList.innerHTML = apps.map(app => `
              <div class="card">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <small>Created: ${new Date(app.created).toLocaleString()}</small>
              </div>
            `).join('');
          }

          // Load apps on page load
          document.addEventListener('DOMContentLoaded', updateAppsList);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>Bolt Dashboard</h1>
            <div class="status">
              <p>✅ Service Active | Environment: ${process.env.NODE_ENV} | Server Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>

          <div class="card">
            <h2>Create New App</h2>
            <form id="appForm" onsubmit="event.preventDefault(); createApp();">
              <div class="form-group">
                <label for="appName">App Name</label>
                <input type="text" id="appName" required placeholder="Enter app name">
              </div>
              <div class="form-group">
                <label for="appDescription">Description</label>
                <textarea id="appDescription" rows="3" placeholder="Enter app description"></textarea>
              </div>
              <button type="submit">Create App</button>
            </form>
          </div>

          <div id="appsList" class="app-list">
            <!-- Apps will be listed here -->
          </div>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    apps: apps.length
  });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
