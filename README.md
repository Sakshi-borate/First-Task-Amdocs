# Task Manager MCP Server

Welcome to your first MCP Server project! This is a simple task management system that works with GitHub Copilot.

## 🎯 What is this project?

This is a **Model Context Protocol (MCP) Server** that helps you manage tasks. Think of it as a smart assistant that can:
- ✅ Create new tasks
- 📋 List all your tasks
- 🔄 Update task status (mark as completed/pending)
- 🗑️ Delete tasks

## 📚 What is MCP?

**MCP (Model Context Protocol)** is a way for AI assistants (like GitHub Copilot) to use external tools and services. Your server acts as a "tool provider" that Copilot can use to help you manage tasks.

**Simple Analogy**: Imagine GitHub Copilot is like a smart assistant, and your MCP server is like a specialized tool in their toolbox. When you ask Copilot to manage tasks, it can use your server to do the actual work.

## 🛠️ How to Set Up

### Step 1: Install Dependencies
Open a terminal and run:
```bash
npm install
```

This downloads all the necessary code libraries your project needs.

### Step 2: Build the Project
Compile the TypeScript code to JavaScript:
```bash
npm run build
```

This converts your TypeScript code (which is easier to write) into JavaScript (which Node.js can run).

### Step 3: Configure in GitHub Copilot

Add this MCP server configuration to VS Code settings:

1. Press `Ctrl+Shift+P` (Windows) to open Command Palette
2. Type "Preferences: Open User Settings (JSON)"
3. Add this configuration:

```json
{
  "github.copilot.chat.mcp.servers": {
    "task-manager": {
      "command": "node",
      "args": ["C:/Users/sakshbor/task-manager-mcp/build/index.js"]
    }
  }
}
```

### Step 4: Test It!
Restart VS Code, then open GitHub Copilot Chat and try:
- "Create a new task to review code"
- "Show me all my tasks"
- "Mark task 1 as completed"
- "Delete task 2"

## 📖 Understanding the Code

### The Main File: `src/index.ts`

This file has everything you need to understand:

1. **Imports** (top of file): Loading the tools we need
2. **Task Interface**: Defines what a task looks like
3. **Task Storage**: Where we keep all tasks in memory
4. **Server Setup**: Creating the MCP server
5. **Tool Definitions**: Telling Copilot what our server can do
6. **Tool Handlers**: The actual code that runs when tools are used

### Key Concepts:

**Interface**: A blueprint that defines the structure of data
```typescript
interface Task {
  id: number;
  title: string;
  // ... more properties
}
```

**Array**: A list that stores multiple items
```typescript
let tasks: Task[] = [];  // An empty list of tasks
```

**Functions**: Code that performs a specific action
```typescript
function createTask() {
  // code to create a task
}
```

## 🎓 Your Learning Path

As a fresher, here's what you should focus on:

1. **Read the code** - Start from top to bottom in `src/index.ts`
2. **Understand each section** - I've added lots of comments
3. **Try modifying it** - Change the messages, add new fields to tasks
4. **Test your changes** - Run `npm run build` and test with Copilot

## 🚀 Next Steps / Enhancements

Once you understand the basics, try these challenges:

1. **Add priority levels** - Add a "priority" field (low, medium, high) to tasks
2. **Add due dates** - Let users set when a task should be completed
3. **Save to file** - Instead of memory, save tasks to a JSON file so they persist
4. **Add categories** - Let users organize tasks by category (work, personal, etc.)

## ❓ Common Questions

**Q: Why TypeScript instead of JavaScript?**
A: TypeScript adds type checking, which helps catch errors before you run the code. It's like having spell-check for programming!

**Q: What is stdio?**
A: It's a way for programs to communicate through standard input/output. Your server reads input and writes output, and Copilot connects to it this way.

**Q: Where is the data stored?**
A: Currently in memory (the `tasks` array). When you restart the server, all tasks are lost. This is fine for learning!

## 🆘 Need Help?

- Check the comments in the code
- Try `console.log()` to see what's happening
- Ask your manager (or GitHub Copilot!) for clarification

## 📝 License

MIT - Feel free to learn and experiment!
