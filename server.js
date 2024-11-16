const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Main interface
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bolt App</title>
        <style>
          body { font-family: Arial; margin: 40px; }
          .container { max-width: 800px; margin: 0 auto; }
          .status { padding: 20px; background: #f0f0f0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bolt App</h1>
          <div class="status">
            <h2>✅ Server Running</h2>
            <p>OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not Configured'}</p>
            <p>Environment: ${process.env.NODE_ENV}</p>
            <p>Server Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Basic API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    res.json({
      response: `Received: ${message}`,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Configured' : 'Not Configured');
});
