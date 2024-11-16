const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create new project
app.post('/api/projects', (req, res) => {
    const { name, template } = req.body;
    res.json({
        id: Date.now(),
        name,
        template,
        created: new Date()
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
