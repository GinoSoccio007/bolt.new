const express = require('express');
const app = express();
const path = require('path');

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Bolt Note Taking App</h1>
    <p>Server is running successfully!</p>
    <p>Login Credentials:</p>
    <ul>
      <li>Username: ${process.env.BOLT_USERNAME}</li>
      <li>Password: ${process.env.BOLT_PASSWORD}</li>
    </ul>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
