import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgxChartsModule } from '@ngx-charts/ngx-charts';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatButtonModule,
    RouterModule,
    NgxChartsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.4s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  // Chart data
  promptStats = [
    { name: 'My Prompts', value: 12 },
    { name: 'Public Prompts', value: 45 },
    { name: 'Saved Prompts', value: 8 }
  ];

  usageData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 180 },
    { name: 'Apr', value: 200 },
    { name: 'May', value: 250 }
  ];

  // Chart options
  view: [number, number] = [700, 300];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  metrics: any = {};

  constructor(
    private themeService: ThemeService,
    private metricsService: MetricsService
  ) {}

  ngOnInit() {
    this.metricsService.getMetrics().subscribe(data => {
      this.metrics = data;
      // Use this.metrics to update your charts
    });
    // Adjust chart view based on screen size
    this.adjustChartView();
    window.addEventListener('resize', () => this.adjustChartView());
  }

  private adjustChartView() {
    const width = window.innerWidth;
    this.view = [width < 768 ? width - 40 : 700, 300];
  }

  get isDarkTheme() {
    return this.themeService.isDarkTheme$;
  }
}
