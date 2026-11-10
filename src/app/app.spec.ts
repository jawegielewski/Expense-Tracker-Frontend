import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the home component at the root URL', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-home')).toBeTruthy();
  });

  it('should stay on the expenses route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/get-expenses');
    fixture.detectChanges();

    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:8080/get-expenses')
      .flush([]);

    expect(router.url).toBe('/get-expenses');
    expect(fixture.nativeElement.querySelector('app-expense-list')).toBeTruthy();
  });

  it('should provide toolbar links to the main pages', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const links = Array.from(fixture.nativeElement.querySelectorAll('.toolbar-links a'))
      .map((link: HTMLAnchorElement) => ({ text: link.textContent.trim(), href: link.getAttribute('href') }));

    expect(links).toEqual([
      { text: 'Home', href: '/home' },
      { text: 'Get expenses', href: '/get-expenses' },
      { text: 'Save expense', href: '/save-expense' },
    ]);
  });
});
