// Test script to create a task using the MCP server
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);
let responseData = '';

server.stdout.on('data', (data) => {
  responseData += data.toString();
  console.log('Response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Wait a moment for server to initialize
setTimeout(() => {
  // Send a request to create a task
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "create_task",
      arguments: {
        title: "Review code",
        description: "Review the task management MCP server code for best practices and improvements"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
  
  // Close after response
  setTimeout(() => {
    server.kill();
    process.exit(0);
  }, 1000);
}, 500);
