import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme.next(savedTheme === 'dark');
    }
  }

  toggleTheme() {
    this.isDarkTheme.next(!this.isDarkTheme.value);
    localStorage.setItem('theme', this.isDarkTheme.value ? 'dark' : 'light');
  }
} 