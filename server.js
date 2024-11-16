const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Basic template
const template = {
    'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World</h1>
    <script src="script.js"></script>
</body>
</html>`,
    'style.css': `body {
    font-family: Arial, sans-serif;
    margin: 40px;
}`,
    'script.js': `console.log('Hello from JavaScript!');`
};

// Create project
app.post('/api/projects', async (req, res) => {
    try {
        const { name } = req.body;
        const id = Date.now().toString();
        const dir = path.join(__dirname, 'projects', id);
        
        await fs.mkdir(dir, { recursive: true });
        
        for (const [file, content] of Object.entries(template)) {
            await fs.writeFile(path.join(dir, file), content);
        }
        
        const project = { id, name, files: Object.keys(template) };
        await fs.writeFile(path.join(dir, 'project.json'), JSON.stringify(project));
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get projects
app.get('/api/projects', async (req, res) => {
    try {
        const dir = path.join(__dirname, 'projects');
        await fs.mkdir(dir, { recursive: true });
        const files = await fs.readdir(dir);
        const projects = [];
        
        for (const file of files) {
            try {
                const data = await fs.readFile(path.join(dir, file, 'project.json'), 'utf8');
                projects.push(JSON.parse(data));
            } catch (error) {
                continue;
            }
        }
        
        res.json(projects);
    } catch (error) {
        res.json([]);
    }
});

// Get file
app.get('/api/projects/:id/files/:file', async (req, res) => {
    try {
        const filepath = path.join(__dirname, 'projects', req.params.id, req.params.file);
        const content = await fs.readFile(filepath, 'utf8');
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read file' });
    }
});

// Save file
app.post('/api/projects/:id/files/:file', async (req, res) => {
    try {
        const filepath = path.join(__dirname, 'projects', req.params.id, req.params.file);
        await fs.writeFile(filepath, req.body.content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save file' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port));
