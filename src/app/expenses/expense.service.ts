import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from './models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  private readonly getExpensesUrl = 'http://localhost:8080/get-expenses';
  private readonly saveExpense = 'http://localhost:8080/save-expense';

  constructor(private http: HttpClient) {}

  public findAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.getExpensesUrl);
  }

  public save(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.saveExpense, expense);
  }
}
