const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
    name: String,
    type: String,
    template: String,
    files: [{
        name: String,
        content: String,
        path: String
    }],
    created: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', ProjectSchema);

// Project Templates
const templates = {
    react: {
        files: [
            {
                name: 'index.html',
                content: `
<!DOCTYPE html>
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
</html>`
            },
            {
                name: 'app.js',
                content: `
function App() {
    return (
        <div>
            <h1>Hello React!</h1>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));`
            }
        ]
    },
    vue: {
        files: [
            {
                name: 'index.html',
                content: `
<!DOCTYPE html>
<html>
<head>
    <title>Vue App</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>
<body>
    <div id="app">
        <h1>{{ message }}</h1>
    </div>
    <script src="app.js"></script>
</body>
</html>`
            },
            {
                name: 'app.js',
                content: `
const app = Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!'
        }
    }
}).mount('#app');`
            }
        ]
    },
    static: {
        files: [
            {
                name: 'index.html',
                content: `
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World!</h1>
    <script src="script.js"></script>
</body>
</html>`
            },
            {
                name: 'style.css',
                content: `
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}`
            },
            {
                name: 'script.js',
                content: `
console.log('Hello from JavaScript!');`
            }
        ]
    }
};

// API Routes
app.post('/api/projects', async (req, res) => {
    try {
        const { name, type } = req.body;
        const template = templates[type] || templates.static;
        
        // Create project directory
        const projectDir = path.join(__dirname, 'projects', name);
        await fs.mkdir(projectDir, { recursive: true });

        // Create project files
        for (const file of template.files) {
            await fs.writeFile(
                path.join(projectDir, file.name),
                file.content.trim()
            );
        }

        // Save to database
        const project = new Project({
            name,
            type,
            template: type,
            files: template.files
        });
        await project.save();

        res.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort('-created');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

app.put('/api/projects/:id/files/:filename', async (req, res) => {
    try {
        const { content } = req.body;
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Update file in filesystem
        const filePath = path.join(__dirname, 'projects', project.name, req.params.filename);
        await fs.writeFile(filePath, content);

        // Update in database
        const fileIndex = project.files.findIndex(f => f.name === req.params.filename);
        if (fileIndex !== -1) {
            project.files[fileIndex].content = content;
            await project.save();
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update file' });
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
