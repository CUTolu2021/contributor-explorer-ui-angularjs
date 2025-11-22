import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

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

      <div *ngIf="error" class="error-message">
        Could not get token. Ensure NestJS backend is running.
      </div>
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
export class LoginComponent {
  loading = false;
  error = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading = true;
    this.error = false;
    
    this.authService.login().subscribe({
      next: () => {
        // Redirect to the main contributors list on success
        this.router.navigate(['/contributors']); 
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
}