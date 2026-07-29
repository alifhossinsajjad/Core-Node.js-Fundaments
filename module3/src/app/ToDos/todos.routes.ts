import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "../../../db/todo.json");

export interface ITodo {
  title: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Helper function to calculate Levenshtein Distance for fuzzy matching
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i]![0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0]![j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charAt(i - 1).toLowerCase() === b.charAt(j - 1).toLowerCase() ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1, // deletion
        matrix[i]![j - 1]! + 1, // insertion
        matrix[i - 1]![j - 1]! + cost // substitution
      );
    }
  }
  return matrix[a.length]![b.length]!;
}

// Helper function to find a todo using fuzzy matching
function findFuzzyTodo(todos: ITodo[], targetTitle: string): ITodo | null {
  let closestTodo: ITodo | null = null;
  let minDistance = Infinity;

  for (const todo of todos) {
    // 1. Direct or case-insensitive partial match
    if (todo.title.toLowerCase().includes(targetTitle.toLowerCase())) {
      return todo;
    }

    // 2. Levenshtein Distance for typos
    const distance = getLevenshteinDistance(todo.title, targetTitle);
    if (distance < minDistance) {
      minDistance = distance;
      closestTodo = todo;
    }
  }

  // Threshold of 3 typos max
  return minDistance <= 3 ? closestTodo : null;
}

export const todosRouter = express.Router();

todosRouter.get("/", (req: Request, res: Response) => {
  const data = fs.readFileSync(filepath, { encoding: "utf-8" });

  res.type("application/json");
  res.send(data);

  // res.send('Get All Todos!');
});

todosRouter.post("/create-todo", (req: Request, res: Response) => {
  const newTodo = req.body as ITodo;

  newTodo.createdAt = new Date().toISOString();

  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  const todos = JSON.parse(data) as ITodo[];

  todos.push(newTodo);

  fs.writeFileSync(filepath, JSON.stringify(todos, null, 2));

  res.status(201).json({
    message: "Todo created successfully!",
    data: newTodo,
  });
});


todosRouter.get("/:title", (req: Request, res: Response) => {
  const todoTitle = req.params.title as string;

  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  const todos = JSON.parse(data) as ITodo[];

  // Use Fuzzy Search algorithm instead of strict equality
  const todo = findFuzzyTodo(todos, todoTitle);

  if (!todo) {
    res.status(404).json({
      message: "Todo not found!",
    });
    return;
  }

  res.status(200).json({
    message: "Todo fetched successfully!",
    data: todo,
  });
});


todosRouter.patch('/update-todo/:title', (req: Request, res: Response) => {
  const todoTitle = req.params.title as string;
  const updateData = req.body;

  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  const todos = JSON.parse(data) as ITodo[];

  const todo = findFuzzyTodo(todos, todoTitle);

  if (!todo) {
    res.status(404).json({
      message: "Todo not found!",
    });
    return;
  }

  // Update the todo object dynamically
  Object.assign(todo, updateData);
  todo.updatedAt = new Date().toISOString();

  fs.writeFileSync(filepath, JSON.stringify(todos, null, 2));

  res.status(200).json({
    message: "Todo updated successfully!",
    data: todo,
  });
});


todosRouter.delete('/delete-todo/:title', (req: Request, res: Response) => {
  const todoTitle = req.params.title as string;

  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  let todos = JSON.parse(data) as ITodo[];

  const todo = findFuzzyTodo(todos, todoTitle);

  if (!todo) {
    res.status(404).json({
      message: "Todo not found!",
    });
    return;
  }

  // Filter out the deleted todo
  todos = todos.filter((t: ITodo) => t.title !== todo.title);

  fs.writeFileSync(filepath, JSON.stringify(todos, null, 2));

  res.status(200).json({
    message: "Todo deleted successfully!",
    data: todo,
  });
});