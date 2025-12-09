import { Routes } from '@angular/router';
import { ContributorDetailsComponent } from './contributors/contributor-details/contributor-details.component';
import { ContributorListComponent } from './contributors/contributor-list/contributor-list.component';
import { RepositoryDetailsComponent } from './repositories/repository-details/repository-details.component';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'contributor/:login', component: ContributorDetailsComponent, canActivate: [authGuard]},
    { path: 'contributors', component: ContributorListComponent, canActivate: [authGuard]},
    { path: 'repo/:repoName', component: RepositoryDetailsComponent, canActivate: [authGuard]},
    { path: '*', pathMatch: 'full', redirectTo: '' }
];

