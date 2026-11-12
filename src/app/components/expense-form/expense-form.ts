import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ExpenseService } from '../../expenses/expense.service';
import { Expense } from '../../expenses/models/expense.model';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css']
})
export class ExpenseFormComponent {
  private expenseService = inject(ExpenseService);

  expense = new Expense();
  dateOfPurchase = '';
  fieldErrors = signal<Record<string, string>>({});
  generalError = signal('');
  isSuccess = signal(false);

  onSubmit(form: NgForm) {
    this.fieldErrors.set({});
    this.generalError.set('');
    this.isSuccess.set(false);

    this.expense.dateMillis = new Date(this.dateOfPurchase).getTime();

    this.expenseService.save(this.expense).subscribe({
      next: () => {
        this.isSuccess.set(true);
        form.resetForm();
        this.expense = new Expense();
        this.dateOfPurchase = '';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Spring Boot validation response:', err.status, err.error);
        this.parseBackendError(err);
      }
    });
  }

  clearFieldError(field: string) {
    this.fieldErrors.update(current => {
      const copy = { ...current };
      delete copy[field];
      return copy;
    });
  }

  private parseBackendError(err: HttpErrorResponse) {
    let payload = err.error;

    // 1. Parse JSON string if Angular didn't auto-parse it
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        this.generalError.set(payload || 'Could not add expense.');
        return;
      }
    }

    if (!payload || typeof payload !== 'object') {
      this.generalError.set('Could not add expense. Please try again.');
      return;
    }

    const mapped: Record<string, string> = {};
    const ignoredKeys = new Set(['status', 'error', 'message', 'timestamp', 'path', 'trace', 'type', 'title', 'detail', 'instance']);

    // 2. Check for Spring Boot's default "errors" array
    if (Array.isArray(payload.errors)) {
      for (const item of payload.errors) {
        const key = this.normalizeField(item?.field);
        const msg = item?.defaultMessage || item?.message;
        if (key && msg) mapped[key] = msg;
      }
    }
    // 3. Check for flat map { name: "...", price: "..." } or nested { errors: { name: "..." } }
    else {
      const source = (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors))
        ? payload.errors
        : payload;

      for (const [rawKey, value] of Object.entries(source)) {
        if (ignoredKeys.has(rawKey)) continue;
        const key = this.normalizeField(rawKey);

        if (typeof value === 'string') {
          mapped[key] = value;
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
          mapped[key] = value[0];
        }
      }
    }

    if (Object.keys(mapped).length > 0) {
      this.fieldErrors.set(mapped);
    } else {
      this.generalError.set(payload.detail || payload.message || payload.error || 'Validation failed.');
    }
  }

  // Converts "expense.name" or "dto.name" -> "name"
  private normalizeField(field?: string): string {
    if (!field) return '';
    return field.includes('.') ? field.split('.').pop()! : field;
  }
}
