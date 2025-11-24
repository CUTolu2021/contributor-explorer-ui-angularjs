import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, map, catchError, finalize, of, debounceTime } from 'rxjs';
import { GithubApiService } from '../../core/github-api.service';
import { Contributor } from '../../core/interface/contributor';

type SortKey = 'totalContributions' | 'followers' | 'public_repos' | 'public_gists';
interface SortOption {
  value: SortKey;
  label: string;
}

@Component({
  selector: 'app-contributor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './contributor-list.component.html',
  styleUrl: './contributor-list.component.css'
})
export class ContributorListComponent implements OnInit {
 
  contributors$!: Observable<Contributor[]>;
  private searchSubject = new BehaviorSubject<string>(''); 
  private sortSubject = new BehaviorSubject<SortKey>('totalContributions'); 

  loading: boolean = true; 
  error: string | null = null;
  
  readonly sortOptions: SortOption[] = [
    { value: 'totalContributions', label: 'Total Contributions' },
    { value: 'followers', label: 'Followers' },
    { value: 'public_repos', label: 'Public Repositories' },
    { value: 'public_gists', label: 'Public Gists' }
  ];
  
  constructor(private githubApi: GithubApiService) { }

  ngOnInit(): void {
    // 1. Fetch the raw data once and apply error handling
    const rawData$ = this.githubApi.getAggregatedContributors().pipe(
      finalize(() => {
        this.loading = false; 
      }),

      catchError(err => {
        console.error('API Error:', err);

        if (err.status === 403) {
          this.error = 'API Rate Limit Exceeded. Please check your token or wait for the reset.';
        } else if (err.status === 404) {
          this.error = 'Backend service not found. Please ensure the NestJS server is running.';
        } else {
          this.error = `An unexpected error occurred: ${err.message}`;
        }
        
        return of([]); 
      })
    );

    // 2. Create a debounced stream for the search term
    const debouncedSearch$ = this.searchSubject.asObservable().pipe(
      debounceTime(400) 
    );

    // 3. Combine all data streams
    this.contributors$ = combineLatest([
      rawData$,
      debouncedSearch$, 
      this.sortSubject.asObservable()
    ]).pipe(
      map(([contributors, searchTerm, sortColumn]) => {
        let filtered = this.filterContributors(contributors, searchTerm);
        let sorted = this.sortContributors(filtered, sortColumn);
        return sorted;
      })
    );
  }

  // --- Filtering Logic ---
  filterContributors(contributors: Contributor[], term: string): Contributor[] {
    if (!term) return contributors;
    const lowerTerm = term.toLowerCase();
    
    // Filter by login (username), name, or bio (if available in details)
    return contributors.filter(c => 
      c.login.toLowerCase().includes(lowerTerm) ||
      c.details?.name?.toLowerCase().includes(lowerTerm) ||
      c.details?.bio?.toLowerCase().includes(lowerTerm)
    );
  }

  // --- Sorting Logic ---
  sortContributors(contributors: Contributor[], column: SortKey): Contributor[] {
    return [...contributors].sort((a, b) => {
      const valA = (a as any)[column] ?? (a.details as any)[column];
      const valB = (b as any)[column] ?? (b.details as any)[column];

      const numA = typeof valA === 'number' ? valA : String(valA).toLowerCase();
      const numB = typeof valB === 'number' ? valB : String(valB).toLowerCase();

      if (numA < numB) return 1; 
      if (numA > numB) return -1;
      return 0;
    });
  }

  // --- Public Methods to update state ---
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onSort(sortKey: string) {
    this.sortSubject.next(sortKey as SortKey);
  }
}