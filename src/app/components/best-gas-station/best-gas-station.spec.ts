import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestGasStationComponent } from './best-gas-station';

describe('BestGasStationComponent', () => {
  let component: BestGasStationComponent;
  let fixture: ComponentFixture<BestGasStationComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestGasStationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BestGasStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask for a recommendation using the entered city', () => {
    component.city = ' Krakow ';
    component.findBestGasStation();

    const request = httpTesting.expectOne('http://localhost:8080/api/question/Krakow');
    expect(request.request.method).toBe('GET');
    request.flush('Recommended station: Example Fuel, Krakow');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Recommended station: Example Fuel, Krakow');
    expect(component.isLoading).toBe(false);
  });

  it('should show a message when the recommendation request fails', () => {
    component.city = 'Krakow';
    component.findBestGasStation();
    httpTesting.expectOne('http://localhost:8080/api/question/Krakow').flush(
      'AI service is unavailable',
      { status: 503, statusText: 'Service Unavailable' },
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('AI service is unavailable');
    expect(component.isLoading).toBe(false);
  });

  it('should not submit an empty city', () => {
    component.findBestGasStation();

    httpTesting.expectNone('http://localhost:8080/api/question');
    expect(component.isLoading).toBe(false);
  });
});
