import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PromptService } from '../../services/prompt.service';
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
import { MatList } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatList,
    MatListItem,
    MatProgressSpinnerModule, MatSidenavContainer, MatSidenav, MatFormField, MatButtonModule, MatCardModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, FormsModule, MatNavList],
  templateUrl: './prompt-detail.component.html',
  styleUrl: './prompt-detail.component.scss'
})
export class PromptDetailComponent implements OnChanges {
  @Input() prompt: any;
  @Output() refresh = new EventEmitter<void>();
  editMode = false;
  editContent = '';
  testResult = '';
  showTest = false;
  testContext = '';
  testData = '';
  testLoading = false;

  constructor(private promptService: PromptService) {}

  ngOnChanges() {
    this.editMode = false;
    this.editContent = this.prompt?.latestVersion?.content || '';
    this.testResult = '';
    this.showTest = false;
    this.testContext = '';
    this.testData = '';
    // If only latestVersion is present, fetch full prompt with versions
    if (this.prompt && !this.prompt.versions) {
      this.promptService.getPrompt(this.prompt.promptId).subscribe(fullPrompt => {
        this.prompt.versions = fullPrompt.versions;
      });
    }
  }

  saveEdit() {
    this.promptService.updatePrompt(this.prompt.promptId, { content: this.editContent })
      .subscribe(() => {
        this.editMode = false;
        this.refresh.emit();
      });
  }

  testPrompt() {
    this.testLoading = true;
    this.promptService.testPrompt(this.prompt.promptId, this.testContext, this.testData)
      .subscribe({
        next: res => {
          this.testResult = res.result;
          this.testLoading = false;
        },
        error: () => {
          this.testLoading = false;
        }
      });
  }
}
