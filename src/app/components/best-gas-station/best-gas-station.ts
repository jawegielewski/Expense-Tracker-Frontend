import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-best-gas-station',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './best-gas-station.html',
  styleUrl: './best-gas-station.css',
})
export class BestGasStationComponent {
  private readonly http = inject(HttpClient);
  private readonly searchUrl = 'http://localhost:8080/best-gas-station';

  city = '';
  result = '';
  errorMessage = '';
  isLoading = false;

  findBestGasStation(): void {
    const city = this.city.trim();
    if (!city || this.isLoading) return;

    this.isLoading = true;
    this.result = '';
    this.errorMessage = '';

    this.http.get(`${this.searchUrl}/${encodeURIComponent(city)}`, { responseType: 'text' }).subscribe({
      next: (result) => {
        this.result = result;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = typeof error.error === 'string' && error.error.trim()
          ? error.error
          : 'Unable to find a gas station right now. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
