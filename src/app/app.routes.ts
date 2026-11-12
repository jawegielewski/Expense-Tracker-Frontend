import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import {ExpenseFormComponent} from './components/expense-form/expense-form';
import {ExpenseListComponent} from './components/expense-list/expense-list';
import { BestGasStationComponent } from './components/best-gas-station/best-gas-station';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'get-expenses', component: ExpenseListComponent },
  { path: 'add-expense', component: ExpenseFormComponent },
  { path: 'save-expense', component: ExpenseFormComponent },
  { path: 'best-gas-station', component: BestGasStationComponent },
  { path: '**', component: NotFoundComponent },
];
