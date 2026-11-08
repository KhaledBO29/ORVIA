import { computed, Injectable, signal } from '@angular/core';
import { DashboardTask } from '../features/dashboard/dashboard.models';

const STORAGE_KEY = 'orvia-dashboard-tasks';

const DEFAULT_TASKS: readonly DashboardTask[] = [
  { id: 'task-1', title: 'Revisar ventas de la semana', completed: false },
  { id: 'task-2', title: 'Aprobar gastos pendientes', completed: true },
  { id: 'task-3', title: 'Actualizar inventario', completed: false },
];

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
  readonly tasks = signal<readonly DashboardTask[]>(this.loadTasks());
  readonly completedCount = computed(() => this.tasks().filter((task) => task.completed).length);

  addTask(title: string): void {
    const newTask: DashboardTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    this.saveTasks([...this.tasks(), newTask]);
  }

  toggleTask(taskId: string): void {
    const updatedTasks = this.tasks().map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    this.saveTasks(updatedTasks);
  }

  private loadTasks(): readonly DashboardTask[] {
    const serializedTasks = localStorage.getItem(STORAGE_KEY);
    if (serializedTasks === null) {
      return DEFAULT_TASKS;
    }

    const parsed: unknown = JSON.parse(serializedTasks);
    if (!Array.isArray(parsed) || !parsed.every(isDashboardTask)) {
      throw new Error(`Los datos guardados bajo "${STORAGE_KEY}" no tienen un formato válido.`);
    }

    return parsed;
  }

  private saveTasks(tasks: readonly DashboardTask[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    this.tasks.set(tasks);
  }
}

function isDashboardTask(value: unknown): value is DashboardTask {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;
  return (
    typeof task['id'] === 'string' &&
    typeof task['title'] === 'string' &&
    typeof task['completed'] === 'boolean'
  );
}
