import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contributor } from './interface/contributor';
import { RepositoryDetails } from './interface/repositorydetails';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private readonly API_BASE_URL = 'http://localhost:3000/github';

  constructor(private http: HttpClient) { }

  getAggregatedContributors(): Observable<Contributor[]> {
    const url = `${this.API_BASE_URL}/contributors`;
    console.log(`Fetching data from: ${url}`);
    
    return this.http.get<Contributor[]>(url);
  }

  getContributorByLogin(login: string): Observable<Contributor> {
    const url = `${this.API_BASE_URL}/contributor/${login}`;
    console.log(`Fetching data from: ${url}`);
    return this.http.get<Contributor>(url);
  }

  getRepoDetails(repoName: string): Observable<RepositoryDetails> {
    const url = `${this.API_BASE_URL}/repo/${repoName}`;
    return this.http.get<RepositoryDetails>(url);
  }
}

