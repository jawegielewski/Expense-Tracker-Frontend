import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExpenseListComponent } from './expense-list';

describe('ExpenseList', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTesting.expectOne('http://localhost:8080/get-expenses').flush([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the purchase date instead of its millisecond value', () => {
    component.expenses = [{
      id: '1',
      name: 'Coffee',
      price: 3,
      dateMillis: Date.UTC(2025, 0, 15),
    }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tbody td:last-child').textContent.trim()).toBe('Jan 15, 2025');
  });
});
