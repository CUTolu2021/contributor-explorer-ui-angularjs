import { CommonModule, DecimalPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable, switchMap, of, catchError, map, startWith } from 'rxjs';
import { GithubApiService } from '../../core/github-api.service';
import { RepositoryDetails } from '../../core/interface/repositorydetails';


@Component({
  selector: 'app-repository-details',
  imports: [
    CommonModule, 
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './repository-details.component.html',
  styleUrl: './repository-details.component.css'
})
export class RepositoryDetailsComponent implements OnInit {
  state$!: Observable<{ repoDetails: RepositoryDetails | null, loading: boolean, error: string | null }>;

  constructor(
    private route: ActivatedRoute,
    private githubApi: GithubApiService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.state$ = this.route.paramMap.pipe(
      switchMap(params => {
        const repoName = params.get('repoName');
        if (!repoName) {
          return of({ repoDetails: null, loading: false, error: null });
        }

        return this.githubApi.getRepoDetails(repoName).pipe(
          map(repoDetails => ({ repoDetails, loading: false, error: null })),
          catchError(err => {
            console.error(err);
            return of({ repoDetails: null, loading: false, error: 'Failed to load repository details.' });
          }),
          startWith({ repoDetails: null, loading: true, error: null })
        );
      })
    );
  }

  goBack(): void {
    this.location.back();
  }
}
