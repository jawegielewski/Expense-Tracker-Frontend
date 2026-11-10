import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Expense } from '../../expenses/models/expense.model';
import { ExpenseService } from '../../expenses/expense.service';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {
  }

  ngOnInit() {
    this.expenseService.findAll().subscribe(data => {
      this.expenses = data;
    });
  }
}
