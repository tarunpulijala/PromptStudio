import { Component, OnInit } from '@angular/core';
import { PromptService } from '../../services/prompt.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { PromptListComponent } from '../../components/prompt-list/prompt-list.component';
import { MatNavList } from '@angular/material/list';
import { MatSidenavContent } from '@angular/material/sidenav';
import { PromptDetailComponent } from '../../components/prompt-detail/prompt-detail.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-my-prompts',
  standalone: true,
  imports: [
    CommonModule,
    MatNavList,
    PromptListComponent,
    MatSidenavContent,
    PromptDetailComponent,
    MatInputModule,
    MatProgressSpinnerModule, MatSidenavContainer, MatSidenav, MatButtonModule, MatCardModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, FormsModule],
  templateUrl: './my-prompts.component.html',
  styleUrls: ['./my-prompts.component.scss']
})
export class MyPromptsComponent implements OnInit {
  prompts: any[] = [];
  selectedPrompt: any = null;
  showCreate = false;
  newPrompt = { appName: '', appId: '', content: '', isPublic: false };

  filter = { appId: '', appName: '' };

  loading = false;

  constructor(private promptService: PromptService) { }

  ngOnInit() {
    this.loadPrompts();
  }

  loadPrompts() {
    this.loading = true;
    this.promptService.getMyPrompts(this.filter.appId, this.filter.appName).subscribe(prompts => {
      this.prompts = prompts;
      this.loading = false;
      if (prompts.length) this.selectedPrompt = prompts[0];
      else this.selectedPrompt = null;
    }, () => {
      this.loading = false;
    });
  }

  onSelectPrompt(prompt: any) {
    this.selectedPrompt = prompt;
  }

  createPrompt() {
    this.promptService.createPrompt(this.newPrompt).subscribe(() => {
      this.showCreate = false;
      this.newPrompt = { appName: '', appId: '', content: '', isPublic: false };
      this.loadPrompts();
    });
  }

  applyFilter() {
    this.loadPrompts();
  }

  clearFilter() {
    this.filter = { appId: '', appName: '' };
    this.loadPrompts();
  }
}
