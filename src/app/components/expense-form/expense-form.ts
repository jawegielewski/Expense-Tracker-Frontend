import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../expenses/expense.service';
import { Expense } from '../../expenses/models/expense.model';

@Component({
  imports: [FormsModule],
  selector: 'app-expense-form',
  standalone: true,
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css']
})
export class ExpenseFormComponent {

  expense: Expense;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService) {
    this.expense = new Expense();
  }

  onSubmit() {
    this.expenseService.save(this.expense).subscribe(result => this.gotoExpenseList());
  }

  gotoExpenseList() {
    this.router.navigate(['/users']);
  }
}
