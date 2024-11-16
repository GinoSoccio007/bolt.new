const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Main route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bolt Status</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .status {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
            margin-top: 20px;
          }
          .status h2 {
            color: #2ecc71;
            margin-top: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bolt Service Status</h1>
          <div class="status">
            <h2>✅ Service Active</h2>
            <p><strong>Status:</strong> Running</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
            <p><strong>Server Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
