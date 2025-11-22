import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, of, catchError, map, startWith } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { Contributor } from '../../core/interface/contributor';
import { GithubApiService } from '../../core/github-api.service';

@Component({
  selector: 'app-contributor-details',
  standalone: true,
  imports: [
     CommonModule,
    RouterLink,
  ],
  templateUrl: './contributor-details.component.html',
  styleUrl: './contributor-details.component.css'
})
export class ContributorDetailsComponent implements OnInit {
  // This single observable will manage all our state
  state$!: Observable<{ contributor: Contributor | null, loading: boolean, error: string | null }>;

  constructor(
    private route: ActivatedRoute,
    private githubApi: GithubApiService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.state$ = this.route.paramMap.pipe(
      switchMap(params => {
        const login = params.get('login');
        if (!login) {
          // Immediately return a state with no loading and no contributor
          return of({ contributor: null, loading: false, error: null });
        }

        return this.githubApi.getContributorByLogin(login).pipe(
          map(contributor => ({ contributor, loading: false, error: null })),

          catchError(err => {
            console.error(err);
            return of({ contributor: null, loading: false, error: 'Failed to load contributor details.' });
          }),
          // Before the API call completes, emit a loading state
          startWith({ contributor: null, loading: true, error: null })
        );
      })
    );
  }

  goBack(): void {
    this.location.back();
  }
}
