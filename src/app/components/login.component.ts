import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: '',
  };
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/rest']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.show(
          'Login successful!',
          response,
          'success',
          3000
        );
        // Redirect to rest component after successful login
        this.router.navigate(['/rest']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed. Please check your credentials.';
        this.toastService.show(
          'Login failed',
          error,
          'error',
          3000
        );
      },
    });
  }
}

