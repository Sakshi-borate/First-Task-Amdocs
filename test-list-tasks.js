// Test script to list all tasks
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Wait for server to initialize
setTimeout(() => {
  // First, create the "Review code" task
  const createRequest = {
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
  
  server.stdin.write(JSON.stringify(createRequest) + '\n');
  
  // Then list all tasks
  setTimeout(() => {
    const listRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "list_tasks",
        arguments: {
          status: "all"
        }
      }
    };
    
    server.stdin.write(JSON.stringify(listRequest) + '\n');
    
    // Close after response
    setTimeout(() => {
      server.kill();
      process.exit(0);
    }, 1000);
  }, 500);
}, 500);
