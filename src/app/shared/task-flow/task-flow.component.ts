import { NgClass, NgFor } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardTask } from '../../features/dashboard/dashboard.models';

@Component({
  imports: [NgClass, NgFor, ReactiveFormsModule],
  selector: 'app-task-flow',
  styleUrl: './task-flow.component.scss',
  templateUrl: './task-flow.component.html',
})
export class TaskFlowComponent {
  readonly tasks = input.required<readonly DashboardTask[]>();
  readonly taskCreated = output<string>();
  readonly taskToggled = output<string>();
  protected readonly completedCount = computed(() => this.tasks().filter((task) => task.completed).length);
  protected readonly progressPercentage = computed(() =>
    this.tasks().length ? Math.round((this.completedCount() / this.tasks().length) * 100) : 0,
  );
  protected readonly taskForm;

  constructor(formBuilder: NonNullableFormBuilder) {
    this.taskForm = formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/\S/)]],
    });
  }

  protected addTask(): void {
    const control = this.taskForm.controls.title;
    const title = control.value.trim();

    if (!title) {
      control.markAsTouched();
      return;
    }

    this.taskCreated.emit(title);
    this.taskForm.reset();
  }
}
