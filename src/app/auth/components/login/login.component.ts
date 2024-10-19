import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service'; // Import StorageService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      // Call the login API with form data
      this.authService.login(this.loginForm.value).subscribe((res) => {
        console.log(res);
        if (res.userId != null) {
          const user = {
            id: res.userId,
            role: res.userRole
          };

          // Save user data and token
          StorageService.saveUser(user);
          StorageService.saveToken(res.jwt);

          // Redirect based on role
          if (StorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl("/admin/dashboard");
          } else if (StorageService.isEmployeeLoggedIn()) {
            this.router.navigateByUrl("/employee/dashboard");
          } else {
            this.snackbar.open("Invalid role", "Close", { duration: 5000 });
          }

          this.snackbar.open("Login successful", "Close", { duration: 5000 });
        } else {
          this.snackbar.open("Invalid credentials", "Close", { duration: 5000 });
        }
      }, (error) => {
        console.error("Login error:", error);
        this.snackbar.open("Login failed. Please try again.", "Close", { duration: 5000 });
      });
    } else {
      console.log('Login Form is invalid');
      this.snackbar.open("Please fill all the required fields correctly!", "Close", { duration: 3000 });
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
