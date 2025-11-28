import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <h2>Welcome to the Contributor Explorer</h2>
      <p>Authentication is required to access GitHub data.</p>
      
      <button (click)="onLogin()" [disabled]="loading" class="login-button">
        {{ loading ? 'Logging In...' : 'Login With Github' }}
      </button>

      @if (error) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }
      @if (loading) {
        <div class="loading-spinner">
          <div class="loading-circle"></div>
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
export class LoginComponent implements OnInit {
  loading = false;
  error = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log('LoginComponent initialized');
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.loading = true;
        this.authService.validateToken(token).pipe(
          
          switchMap(isValid => {
            if (isValid) {
              alert('Login successful! Redirecting...');
              return this.router.navigate(['/contributors']);
            } else {
              alert('Error: Invalid token detected. Please sign in again. Avoid using incognito mode for authentication.');
              this.error = true;
              this.errorMessage = 'Invalid token. Please try logging in again.';
              this.loading = false;
              return of(null);
            }
          })
        ).subscribe(
          () => this.loading = false, 
            error => { 
              this.loading = false;
              this.error = true;
              this.errorMessage = 'A network error occurred.';
            }
        );
      }
    });
  }


  onLogin(): void {

    this.authService.loginRedirect();
  }
}