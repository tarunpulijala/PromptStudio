import { Component, OnInit } from '@angular/core';
import { PromptService } from '../../services/prompt.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatFormField } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNavList } from '@angular/material/list';
import { MatCard } from '@angular/material/card';
import { PromptListComponent } from '../../components/prompt-list/prompt-list.component';
import { PromptDetailComponent } from '../../components/prompt-detail/prompt-detail.component';
@Component({
  selector: 'app-public-prompts',
  standalone: true,
  imports: [MatNavList,
    PromptListComponent,
    PromptDetailComponent,
    MatSidenavContent,
    MatCard,
    MatProgressSpinnerModule, MatSidenavContainer, MatSidenav, MatFormField, MatButtonModule, MatCardModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, FormsModule],
  templateUrl: './public-prompts.component.html',
  styleUrls: ['./public-prompts.component.scss']
})
export class PublicPromptsComponent implements OnInit {
  prompts: any[] = [];
  selectedPrompt: any = null;

  constructor(private promptService: PromptService) {}

  ngOnInit() {
    this.loadPrompts();
  }

  loadPrompts() {
    this.promptService.getPublicPrompts().subscribe(prompts => {
      this.prompts = prompts;
      if (prompts.length) this.selectedPrompt = prompts[0];
    });
  }

  onSelectPrompt(prompt: any) {
    this.selectedPrompt = prompt;
  }
}
