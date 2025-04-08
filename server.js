const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};

const server = http.createServer((req, res) => {
    // Default to index.html for root path
    let filePath = req.url === '/' ? './index.html' : '.' + decodeURIComponent(req.url);
    
    // Remove query strings from path
    filePath = filePath.split('?')[0];
    
    // Ensure the path is within the project directory
    filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                // Try index.html for directory requests
                if (req.url.endsWith('/')) {
                    const indexPath = path.join(filePath, 'index.html');
                    fs.readFile(indexPath, (indexError, indexContent) => {
                        if (indexError) {
                            res.writeHead(404);
                            res.end('File not found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(indexContent, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(404);
                    res.end('File not found');
                }
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            // Set CORS headers to allow loading content from any origin
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});