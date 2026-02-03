import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Server output:', data.toString());
});

setTimeout(() => {
  // Update the manager's task to completed
  const updateTask = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "update_task_status",
      arguments: {
        taskId: 1,
        status: "completed"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(updateTask) + '\n');
  
  setTimeout(() => {
    // List all tasks to confirm
    const listTasks = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "list_tasks",
        arguments: {}
      }
    };
    
    server.stdin.write(JSON.stringify(listTasks) + '\n');
    
    setTimeout(() => {
      server.kill();
      process.exit(0);
    }, 1000);
  }, 1000);
}, 500);
