import fs from "fs/promises";
import path from "path";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
}

export interface Product {
  slug: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isDraft: boolean;
  userId: string;
  createdAt: string;
}

export interface Log {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  service: string;
  message: string;
}

interface Database {
  tasks: Task[];
  products: Product[];
  inventory: Record<string, number>;
  notes: Note[];
  logs: Log[];
}

const dbPath = path.join(process.cwd(), "src/data/db.json");

// Helper to read database
async function readDB(): Promise<Database> {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const parsed = JSON.parse(data);
    return {
      tasks: parsed.tasks || [],
      products: parsed.products || [],
      inventory: parsed.inventory || {},
      notes: parsed.notes || [],
      logs: parsed.logs || [],
    };
  } catch (e) {
    console.error("Failed to read database, returning empty default", e);
    return { tasks: [], products: [], inventory: {}, notes: [], logs: [] };
  }
}

// Helper to write database
async function writeDB(db: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

/* --- Tasks Operations --- */

export async function getTasks(): Promise<Task[]> {
  const db = await readDB();
  return db.tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createTask(title: string, description: string, status: Task["status"] = "todo"): Promise<Task> {
  const db = await readDB();
  const newTask: Task = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };
  db.tasks.push(newTask);
  await writeDB(db);
  return newTask;
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<Task | null> {
  const db = await readDB();
  const taskIndex = db.tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return null;

  db.tasks[taskIndex].status = status;
  await writeDB(db);
  return db.tasks[taskIndex];
}

export async function deleteTask(id: string): Promise<boolean> {
  const db = await readDB();
  const initialLength = db.tasks.length;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  if (db.tasks.length === initialLength) return false;

  await writeDB(db);
  return true;
}

/* --- Products & Inventory Operations --- */

export async function getProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await readDB();
  return db.products.find((p) => p.slug === slug) || null;
}

// Slow query to fetch inventory, showing Suspense loading stream
export async function getProductInventory(slug: string): Promise<number> {
  // Add a 1.5s delay to simulate slow database or external API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const db = await readDB();
  const count = db.inventory[slug];
  return count !== undefined ? count : 0;
}

/* --- Notes Operations --- */

export async function getNotes(userId: string): Promise<Note[]> {
  const db = await readDB();
  return db.notes
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createNote(
  title: string,
  content: string,
  isDraft: boolean,
  userId: string
): Promise<Note> {
  const db = await readDB();
  const newNote: Note = {
    id: "n-" + Math.random().toString(36).substring(2, 9),
    title,
    content,
    isDraft,
    userId,
    createdAt: new Date().toISOString(),
  };
  db.notes.push(newNote);
  await writeDB(db);
  return newNote;
}

/* --- Logs Operations --- */

export async function getLogs(offset: number, limit: number): Promise<{ logs: Log[]; hasMore: boolean }> {
  const db = await readDB();
  const sortedLogs = [...db.logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const sliced = sortedLogs.slice(offset, offset + limit);
  const hasMore = offset + limit < sortedLogs.length;
  
  return {
    logs: sliced,
    hasMore,
  };
}
