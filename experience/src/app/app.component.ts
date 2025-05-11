import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private themeService: ThemeService;
  isDarkTheme$;

  constructor(themeService: ThemeService) {
    this.themeService = themeService;
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}