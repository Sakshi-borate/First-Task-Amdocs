// Complete test: create tasks, list, update, delete
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

setTimeout(() => {
  // Create task 1
  const createTask1 = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "create_task",
      arguments: {
        title: "Review code",
        description: "Review the task management MCP server code for best practices"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(createTask1) + '\n');
  
  setTimeout(() => {
    // Create task 2
    const createTask2 = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "create_task",
        arguments: {
          title: "Write documentation",
          description: "Complete the README with examples"
        }
      }
    };
    
    server.stdin.write(JSON.stringify(createTask2) + '\n');
    
    setTimeout(() => {
      // List all tasks
      const listRequest = {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "list_tasks",
          arguments: { status: "all" }
        }
      };
      
      server.stdin.write(JSON.stringify(listRequest) + '\n');
      
      setTimeout(() => {
        // Mark task 1 as completed
        const updateRequest = {
          jsonrpc: "2.0",
          id: 4,
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
        
        setTimeout(() => {
          // Delete task 2
          const deleteRequest = {
            jsonrpc: "2.0",
            id: 5,
            method: "tools/call",
            params: {
              name: "delete_task",
              arguments: { taskId: 2 }
            }
          };
          
          server.stdin.write(JSON.stringify(deleteRequest) + '\n');
          
          setTimeout(() => {
            // List final state
            const finalListRequest = {
              jsonrpc: "2.0",
              id: 6,
              method: "tools/call",
              params: {
                name: "list_tasks",
                arguments: { status: "all" }
              }
            };
            
            server.stdin.write(JSON.stringify(finalListRequest) + '\n');
            
            setTimeout(() => {
              server.kill();
              process.exit(0);
            }, 1000);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}, 500);
