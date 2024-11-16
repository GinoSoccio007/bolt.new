import { WebContainer } from '@webcontainer/api';

let webcontainerInstance;

window.addEventListener('load', async () => {
    // Initialize the WebContainer
    webcontainerInstance = await WebContainer.boot();
    
    try {
        // Mount the files
        await webcontainerInstance.mount({
            'index.js': {
                file: {
                    contents: `
                        import express from 'express';
                        const app = express();
                        const port = 3000;
                        
                        app.get('/', (req, res) => {
                            res.send('Hello from WebContainer!');
                        });
                        
                        app.listen(port, () => {
                            console.log(\`Server running at http://localhost:\${port}\`);
                        });
                    `,
                },
            },
            'package.json': {
                file: {
                    contents: `
                        {
                            "name": "example-app",
                            "type": "module",
                            "dependencies": {
                                "express": "latest"
                            },
                            "scripts": {
                                "start": "node index.js"
                            }
                        }
                    `,
                },
            },
        });

        // Install dependencies
        const installProcess = await webcontainerInstance.spawn('npm', ['install']);
        const installExitCode = await installProcess.exit;
        
        if (installExitCode !== 0) {
            throw new Error('Installation failed');
        }

        // Start the dev server
        const serverProcess = await webcontainerInstance.spawn('npm', ['start']);
        
        // Listen to server output
        serverProcess.output.pipe(new WritableStream({
            write(data) {
                console.log(data);
            }
        }));

    } catch (error) {
        console.error('Error:', error);
    }
});
