import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <h2>Welcome to the Contributor Explorer</h2>
      <p>Authentication is required to access GitHub data.</p>
      
      <button (click)="onLogin()" [disabled]="loading" class="login-button">
        {{ loading ? 'Logging In...' : 'Get Access Token' }}
      </button>

      @if (error) {
        <div class="error-message">
        Could not get token. Ensure NestJS backend is running.
        </div>
      } 
    </div>
  `,
  styles: [`
    .login-container { text-align: center; padding: 50px; }
    .login-button { 
      padding: 10px 20px; 
      background-color: #DD0031; 
      color: white; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
      margin-top: 20px;
    }
    .error-message { color: #DD0031; margin-top: 15px; }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  error = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token from URL:', token);

    if (token) {
      this.loading = true;
      console.log('Saving token to localStorage...');
      this.authService.saveToken(token);

      // Validate token asynchronously
      this.authService.validateToken(token).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (isValid) => {
          console.log('Token validation result:', isValid);
          this.loading = false;

          if (isValid) {
            console.log('Token validated successfully. Navigating to /contributors');
            this.router.navigate(['/contributors']);
          } else {
            console.error('Token validation failed');
            localStorage.removeItem('auth_token');
            this.error = true;
          }
        },
        error: (err) => {
          console.error('Token validation error:', err);
          this.loading = false;
          localStorage.removeItem('auth_token');
          this.error = true;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    this.loading = true;
    this.error = false;
    this.authService.loginRedirect();
  }
}

