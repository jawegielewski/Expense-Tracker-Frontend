import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ExpenseService } from './expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseService, provideHttpClient()],
    });
    service = TestBed.inject(ExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
