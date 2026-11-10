import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgForm } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ExpenseFormComponent } from './expense-form';

describe('ExpenseForm', () => {
  let component: ExpenseFormComponent;
  let fixture: ComponentFixture<ExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a success message when the expense is saved', () => {
    const httpTestingController = TestBed.inject(HttpTestingController);
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

    component.onSubmit(form);
    httpTestingController.expectOne('http://localhost:8080/save-expense').flush(
      'Expense saved successfully',
      { status: 200, statusText: 'OK' },
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Expense added successfully.');
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });

  it('should display Spring validation errors when saving fails', () => {
    const httpTestingController = TestBed.inject(HttpTestingController);
    const backendMessages = [
      { field: 'name', defaultMessage: 'Name must not be blank' },
      { field: 'price', defaultMessage: 'Price must be greater than zero' },
      { field: 'date', defaultMessage: 'Date is required' },
    ];

    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    component.onSubmit(form);
    httpTestingController.expectOne('http://localhost:8080/save-expense').flush(
      {
        status: 400,
        error: 'Bad Request',
        errors: backendMessages,
      },
      { status: 400, statusText: 'Bad Request' },
    );
    fixture.detectChanges();

    fixture.detectChanges();

    expect(component.fieldErrors()['name']).toBe(backendMessages[0].defaultMessage);
    expect(component.fieldErrors()['price']).toBe(backendMessages[1].defaultMessage);
    expect(fixture.nativeElement.textContent).toContain(backendMessages[0].defaultMessage);
    expect(fixture.nativeElement.textContent).toContain(backendMessages[1].defaultMessage);
  });
});
