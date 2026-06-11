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

interface Database {
  tasks: Task[];
  products: Product[];
  inventory: Record<string, number>;
}

const dbPath = path.join(process.cwd(), "src/data/db.json");

// Helper to read database
async function readDB(): Promise<Database> {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to read database, returning empty default", e);
    return { tasks: [], products: [], inventory: {} };
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
