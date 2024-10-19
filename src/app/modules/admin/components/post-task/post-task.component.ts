import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss'], // Corrected 'styleUrl' to 'styleUrls'
})
export class PostTaskComponent {
  taskForm!: FormGroup;
  listOfEmployees: any = [];

  // Mapping priorities to integers
  listOfPriorities: any = [
    { value: 1, label: 'LOW' },
    { value: 2, label: 'MEDIUM' },
    { value: 3, label: 'HIGH' },
  ];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.getUsers();
    this.taskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
    });
  }

  getUsers() {
    this.adminService.getUsers().subscribe((res) => {
      this.listOfEmployees = res;
      console.log(res);
    });
  }

  postTask() {
    // Prepare the task data to send
    const taskData = {
      ...this.taskForm.value,
      priority: this.taskForm.value.priority.value // Accessing the integer value of priority
    };

    console.log(taskData);
    this.adminService.postTask(taskData).subscribe((res) => {
      if (res.id != null) {
        this.snackbar.open('Task posted successfully', 'Close', { duration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.snackbar.open('Something went wrong', 'ERROR', { duration: 5000 });
      }
    });
  }
}
