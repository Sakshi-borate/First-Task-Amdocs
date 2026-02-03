import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Server output:', data.toString());
});

setTimeout(() => {
  const createTask = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "create_task",
      arguments: {
        title: "Learn Python",
        description: "Complete Python tutorial and practice exercises"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(createTask) + '\n');
  
  setTimeout(() => {
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
