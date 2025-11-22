import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'contributor-explorer-ui';

  // Inject AuthService and Router
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // If the user is NOT logged in (no token found in storage),
    // redirect them to the /login page immediately.
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
}
