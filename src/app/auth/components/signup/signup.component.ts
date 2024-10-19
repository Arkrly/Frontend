import { AuthService } from './../../services/auth/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit() {
    const { password, confirmPassword } = this.signupForm.value;

    // Check if passwords match
    if (password !== confirmPassword) {
      this.signupForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.snackbar.open('Passwords do not match!', 'Close', {
        duration: 5000,
      });
      return; // Stop submission if passwords do not match
    }

    if (this.signupForm.valid) {
      // Proceed with the signup process
      this.authService.signup(this.signupForm.value).subscribe(
        (response) => {
          this.snackbar.open('Signup successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/login']); // Redirect to login page upon successful signup
        },
        (error) => {
          this.snackbar.open('Signup failed. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackbar.open('Please fill all the required fields correctly!', 'Close', {
        duration: 3000,
      });
    }
  }
}
