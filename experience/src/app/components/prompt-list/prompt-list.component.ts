import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatFormField } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNavList } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListItem,
    MatProgressSpinnerModule,
    MatSidenavContainer,
    MatSidenav,
    MatFormField,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    FormsModule,
    MatNavList
  ],
  templateUrl: './prompt-list.component.html',
  styleUrl: './prompt-list.component.scss'
})
export class PromptListComponent {
  @Input() prompts: any[] = [];
  @Output() selectPrompt = new EventEmitter<any>();
}
