import { TestBed } from '@angular/core/testing';
import { TaskStoreService } from './task-store.service';

describe('TaskStoreService', () => {
  let taskStore: TaskStoreService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    taskStore = TestBed.inject(TaskStoreService);
  });

  it('starts with example tasks and a completed-task count', () => {
    expect(taskStore.tasks().length).toBe(3);
    expect(taskStore.completedCount()).toBe(1);
  });

  it('updates the signal and persists checkbox changes', () => {
    taskStore.toggleTask('task-1');

    expect(taskStore.tasks()[0]?.completed).toBe(true);
    expect(taskStore.completedCount()).toBe(2);
    expect(localStorage.getItem('orvia-dashboard-tasks')).toContain('"completed":true');
  });
});
