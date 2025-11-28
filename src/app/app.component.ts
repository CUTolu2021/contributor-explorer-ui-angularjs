import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'contributor-explorer-ui';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Navigate to login on app start
    //this.router.navigate(['/login']);
  }
}
