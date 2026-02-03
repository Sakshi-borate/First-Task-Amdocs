// Execute the three user commands
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);

let responseCount = 0;

server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        console.log('\n=== Response ===');
        if (response.result && response.result.content) {
          console.log(response.result.content[0].text);
        } else {
          console.log(JSON.stringify(response, null, 2));
        }
      } catch (e) {
        // Not JSON, just print it
        console.log(line);
      }
    }
  });
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Wait for server to start
setTimeout(() => {
  console.log('=== Step 1: Create a task to review code ===');
  const createTask = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "create_task",
      arguments: {
        title: "Review code",
        description: "Review the code implementation"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(createTask) + '\n');
  
  setTimeout(() => {
    console.log('\n=== Step 2: Show all tasks ===');
    const listTasks = {
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
    
    server.stdin.write(JSON.stringify(listTasks) + '\n');
    
    setTimeout(() => {
      console.log('\n=== Step 3: Mark task 1 as completed ===');
      const updateTask = {
        jsonrpc: "2.0",
        id: 3,
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
      
      // Wait a bit then show final task list
      setTimeout(() => {
        console.log('\n=== Final task list after update ===');
        const finalList = {
          jsonrpc: "2.0",
          id: 4,
          method: "tools/call",
          params: {
            name: "list_tasks",
            arguments: {
              status: "all"
            }
          }
        };
        
        server.stdin.write(JSON.stringify(finalList) + '\n');
        
        setTimeout(() => {
          server.kill();
          process.exit(0);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
