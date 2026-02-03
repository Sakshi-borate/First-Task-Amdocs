// Test script to perform multiple operations
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);
let responseData = '';

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Wait for server to initialize
setTimeout(() => {
  // 1. List all tasks
  const listRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "list_tasks",
      arguments: {
        status: "all"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(listRequest) + '\n');
  
  // 2. Mark task 1 as completed
  setTimeout(() => {
    const updateRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "update_task_status",
        arguments: {
          taskId: 1,
          status: "completed"
        }
      }
    };
    
    server.stdin.write(JSON.stringify(updateRequest) + '\n');
    
    // 3. Delete task 2
    setTimeout(() => {
      const deleteRequest = {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "delete_task",
          arguments: {
            taskId: 2
          }
        }
      };
      
      server.stdin.write(JSON.stringify(deleteRequest) + '\n');
      
      // Close after operations
      setTimeout(() => {
        server.kill();
        process.exit(0);
      }, 1000);
    }, 500);
  }, 500);
}, 500);
