import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyPromptsComponent } from './pages/my-prompts/my-prompts.component';
import { PublicPromptsComponent } from './pages/public-prompts/public-prompts.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-prompts', component: MyPromptsComponent },
  { path: 'public-prompts', component: PublicPromptsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}