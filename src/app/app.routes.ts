import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import {ExpenseFormComponent} from './components/expense-form/expense-form';
import {ExpenseListComponent} from './components/expense-list/expense-list';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'get-expenses', component: ExpenseListComponent },
  { path: 'add-expense', component: ExpenseFormComponent },
  { path: '**', component: NotFoundComponent },
];
