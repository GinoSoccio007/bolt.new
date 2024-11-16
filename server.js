const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  res.send(`
    <html>
      <head>
        <title>Bolt Server Dashboard</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
            color: #333;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eef2f5;
          }
          .status-box {
            background-color: #ecfdf5;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e1e8ed;
          }
          .status-badge {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          .metric-title {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .metric-value {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
          }
          h1 {
            margin: 0;
            color: #111827;
          }
          .refresh-button {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .refresh-button:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bolt Server Dashboard</h1>
            <span class="status-badge">✅ Operational</span>
          </div>

          <div class="grid">
            <div class="metric-card">
              <div class="metric-title">ENVIRONMENT</div>
              <div class="metric-value">${process.env.NODE_ENV || 'development'}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">PORT</div>
              <div class="metric-value">${process.env.PORT || 3000}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">USERNAME</div>
              <div class="metric-value">${process.env.BOLT_USERNAME}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">SERVER TIME</div>
              <div class="metric-value">${new Date().toLocaleString()}</div>
            </div>
          </div>

          <div class="status-box">
            <h2>System Status</h2>
            <div class="grid">
              <div class="metric-card">
                <div class="metric-title">UPTIME</div>
                <div class="metric-value">${days}d ${hours}h ${minutes}m ${seconds}s</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">MEMORY USAGE</div>
                <div class="metric-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">NODE VERSION</div>
                <div class="metric-value">${process.version}</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">PLATFORM</div>
                <div class="metric-value">${process.platform}</div>
              </div>
            </div>
          </div>

          <button class="refresh-button" onclick="location.reload()">Refresh Dashboard</button>
        </div>
      </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
