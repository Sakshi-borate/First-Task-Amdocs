#!/usr/bin/env node

/**
 * TASK MANAGER MCP SERVER
 * 
 * This is your first MCP (Model Context Protocol) server!
 * Think of this as a smart assistant that helps manage tasks.
 * 
 * What does this server do?
 * - Creates new tasks
 * - Lists all tasks
 * - Updates task status
 * - Deletes tasks
 */

// Import the MCP SDK - this is like importing a toolbox that helps us build our server
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * TASK INTERFACE
 * This defines what a task looks like - it's like a blueprint
 */
interface Task {
  id: number;           // Unique number for each task
  title: string;        // What the task is about
  description: string;  // More details about the task
  status: "pending" | "completed";  // Is it done or not?
  createdAt: Date;      // When was it created
}

/**
 * TASK STORAGE
 * We store all tasks in memory (in this array)
 * Note: When you restart the server, all tasks will be lost
 * In a real project, you'd save this to a database
 */
let tasks: Task[] = [];
let nextTaskId = 1;  // This helps us give each task a unique ID

/**
 * CREATE THE SERVER
 * This is like opening a shop - we're setting up our service
 */
const server = new Server(
  {
    name: "task-manager-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},  // We're telling the server we'll provide tools
    },
  }
);

/**
 * LIST AVAILABLE TOOLS
 * This tells GitHub Copilot (or other clients) what our server can do
 * It's like showing a menu at a restaurant
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_task",
        description: "Create a new task with a title and description",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The title of the task",
            },
            description: {
              type: "string",
              description: "Detailed description of the task",
            },
          },
          required: ["title", "description"],
        },
      },
      {
        name: "list_tasks",
        description: "List all tasks with their details",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["all", "pending", "completed"],
              description: "Filter tasks by status (default: all)",
            },
          },
        },
      },
      {
        name: "update_task_status",
        description: "Update the status of a task (mark as completed or pending)",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "number",
              description: "The ID of the task to update",
            },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              description: "The new status for the task",
            },
          },
          required: ["taskId", "status"],
        },
      },
      {
        name: "delete_task",
        description: "Delete a task by its ID",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "number",
              description: "The ID of the task to delete",
            },
          },
          required: ["taskId"],
        },
      },
    ],
  };
});

/**
 * HANDLE TOOL CALLS
 * This is where the actual work happens!
 * When someone uses one of our tools, this code runs
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Check which tool was called and do the appropriate action
    switch (name) {
      case "create_task": {
        // CREATE A NEW TASK
        const { title, description } = args as { title: string; description: string };
        
        const newTask: Task = {
          id: nextTaskId++,
          title,
          description,
          status: "pending",
          createdAt: new Date(),
        };
        
        tasks.push(newTask);
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Task created successfully!\n\nID: ${newTask.id}\nTitle: ${newTask.title}\nDescription: ${newTask.description}\nStatus: ${newTask.status}`,
            },
          ],
        };
      }

      case "list_tasks": {
        // LIST ALL TASKS (with optional filtering)
        const { status = "all" } = args as { status?: string };
        
        let filteredTasks = tasks;
        if (status !== "all") {
          filteredTasks = tasks.filter((task) => task.status === status);
        }
        
        if (filteredTasks.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "📝 No tasks found.",
              },
            ],
          };
        }
        
        // Format the tasks nicely for display
        const taskList = filteredTasks
          .map((task) => {
            const statusIcon = task.status === "completed" ? "✅" : "⏳";
            return `${statusIcon} ID: ${task.id}\n   Title: ${task.title}\n   Description: ${task.description}\n   Status: ${task.status}\n   Created: ${task.createdAt.toLocaleString()}`;
          })
          .join("\n\n");
        
        return {
          content: [
            {
              type: "text",
              text: `📋 Task List (Total: ${filteredTasks.length})\n\n${taskList}`,
            },
          ],
        };
      }

      case "update_task_status": {
        // UPDATE A TASK'S STATUS
        const { taskId, status } = args as { taskId: number; status: "pending" | "completed" };
        
        const task = tasks.find((t) => t.id === taskId);
        
        if (!task) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Error: Task with ID ${taskId} not found.`,
              },
            ],
          };
        }
        
        task.status = status;
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Task updated successfully!\n\nID: ${task.id}\nTitle: ${task.title}\nNew Status: ${task.status}`,
            },
          ],
        };
      }

      case "delete_task": {
        // DELETE A TASK
        const { taskId } = args as { taskId: number };
        
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        
        if (taskIndex === -1) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Error: Task with ID ${taskId} not found.`,
              },
            ],
          };
        }
        
        const deletedTask = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        
        return {
          content: [
            {
              type: "text",
              text: `🗑️ Task deleted successfully!\n\nDeleted Task:\nID: ${deletedTask.id}\nTitle: ${deletedTask.title}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `❌ Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * START THE SERVER
 * This is like opening the doors of your shop
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Task Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
