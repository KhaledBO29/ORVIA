import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTask } from '../../features/dashboard/dashboard.models';
import { TaskFlowComponent } from './task-flow.component';

describe('TaskFlowComponent', () => {
  let fixture: ComponentFixture<TaskFlowComponent>;
  const tasks: readonly DashboardTask[] = [
    { id: 'one', title: 'Revisar ventas', completed: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFlowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFlowComponent);
    fixture.componentRef.setInput('tasks', tasks);
    fixture.detectChanges();
  });

  it('emits the task id when its checkbox changes', () => {
    const taskToggled = vi.fn();
    fixture.componentInstance.taskToggled.subscribe(taskToggled);

    fixture.nativeElement.querySelector('input[type="checkbox"]').dispatchEvent(new Event('change'));

    expect(taskToggled).toHaveBeenCalledWith('one');
  });

  it('emits a valid reactive-form task and clears the input', () => {
    const taskCreated = vi.fn();
    fixture.componentInstance.taskCreated.subscribe(taskCreated);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#new-task');

    input.value = 'Preparar informe';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(taskCreated).toHaveBeenCalledWith('Preparar informe');
    expect(input.value).toBe('');
  });
});
