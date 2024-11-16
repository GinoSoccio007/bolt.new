const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Project templates
const templates = {
    react: {
        'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>React App</title>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel" src="app.js"></script>
</body>
</html>`,
        'app.js': `function App() {
    const [count, setCount] = React.useState(0);
    
    return (
        <div>
            <h1>React Counter App</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));`
    },
    vue: {
        'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>Vue App</title>
    <script src="https://unpkg.com/vue@3"></script>
</head>
<body>
    <div id="app">
        <h1>{{ message }}</h1>
        <button @click="count++">Count is: {{ count }}</button>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
        'app.js': `Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',
            count: 0
        }
    }
}).mount('#app')`
    },
    static: {
        'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to my website.</p>
    <script src="script.js"></script>
</body>
</html>`,
        'style.css': `body {
    font-family: Arial, sans-serif;
    margin: 40px;
    line-height: 1.6;
}

h1 {
    color: #333;
}`,
        'script.js': `console.log('Hello from JavaScript!');

// Add your JavaScript code here
document.querySelector('h1').addEventListener('click', () => {
    alert('Hello!');
});`
    }
};

// API Routes
app.get('/api/projects', async (req, res) => {
    try {
        const projectsDir = path.join(__dirname, 'projects');
        await fs.mkdir(projectsDir, { recursive: true });
        
        const dirs = await fs.readdir(projectsDir);
        const projects = await Promise.all(
            dirs.map(async (dir) => {
                try {
                    const configPath = path.join(projectsDir, dir, 'project.json');
                    const content = await fs.readFile(configPath, 'utf8');
                    return JSON.parse(content);
                } catch (error) {
                    return null;
                }
            })
        );
        
        res.json(projects.filter(p => p !== null));
    } catch (error) {
        console.error('Error loading projects:', error);
        res.json([]);
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { name, type } = req.body;
        const projectId = Date.now().toString();
        const projectDir = path.join(__dirname, 'projects', projectId);
        
        // Create project directory
        await fs.mkdir(projectDir, { recursive: true });
        
        // Create project files from template
        const template = templates[type] || templates.static;
        for (const [filename, content] of Object.entries(template)) {
            await fs.writeFile(
                path.join(projectDir, filename),
                content.trim()
            );
        }
        
        // Save project metadata
        const project = {
            id: projectId,
            name,
            type,
            created: new Date().toISOString(),
            files: Object.keys(template)
        };
        
        await fs.writeFile(
            path.join(projectDir, 'project.json'),
            JSON.stringify(project, null, 2)
        );
        
        res.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get project file content
app.get('/api/projects/:id/files/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'projects'
