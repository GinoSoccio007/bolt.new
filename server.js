const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Get project files
app.get('/api/projects/:id/files', async (req, res) => {
    try {
        const projectDir = path.join('projects', req.params.id);
        const files = await fs.readdir(projectDir);
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get project files' });
    }
});

// Get file content
app.get('/api/projects/:id/files/:filename', async (req, res) => {
    try {
        const filePath = path.join('projects', req.params.id, req.params.filename);
        const content = await fs.readFile(filePath, 'utf8');
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read file' });
    }
});

// Save file content
app.post('/api/projects/:id/files/:filename', async (req, res) => {
    try {
        const filePath = path.join('projects', req.params.id, req.params.filename);
        await fs.writeFile(filePath, req.body.content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save file' });
    }
});

// Keep your existing routes here...

app.listen(3000, () => console.log('Server running on port 3000'));
