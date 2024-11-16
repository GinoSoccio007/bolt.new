const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Ensure our directories exist
const ensureDirectories = async () => {
    try {
        await fs.mkdir('data', { recursive: true });
        await fs.mkdir('projects', { recursive: true });
        await fs.mkdir('public', { recursive: true });
        console.log('Directories created successfully');
    } catch (error) {
        console.error('Error creating directories:', error);
    }
};

// Templates for different project types
const templates = {
    static: {
        'index.html': `
<!DOCTYPE html>
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
        'style.css': `
body {
    font-family: Arial, sans-serif;
    margin: 40px;
}`,
        'script.js': `console.log('Hello from JavaScript!');`
    }
};

// API Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/projects', async (req, res) => {
    try {
        const { name, type = 'static' } = req.body;
        const projectId = Date.now().toString();
        
        // Create project metadata
        const project = {
            id: projectId,
            name,
            type,
            created: new Date().toISOString()
        };

        // Save project metadata
        await fs.writeFile(
            path.join('data', `${projectId}.json`),
            JSON.stringify(project, null, 2)
        );

        // Create project directory and files
        const projectDir = path.join('projects', projectId);
        await fs.mkdir(projectDir, { recursive: true });

        // Create template files
        const template = templates[type] || templates.static;
        for (const [filename, content] of Object.entries(template)) {
            await fs.writeFile(
                path.join(projectDir, filename),
                content.trim()
            );
        }

        res.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.get('/api/projects', async (req, res) => {
    try {
        const files = await fs.readdir('data');
        const projects = await Promise.all(
            files
                .filter(file => file.endsWith('.json'))
                .map(async file => {
                    const content = await fs.readFile(path.join('data', file), 'utf8');
                    return JSON.parse(content);
                })
        );
        res.json(projects.sort((a, b) => b.id - a.id));
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.json([]);
    }
});

// Start server after ensuring directories exist
const startServer = async () => {
    await ensureDirectories();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer().catch(error => {
    console.error('Failed to start server:', error);
});
