import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPromptsComponent } from './public-prompts.component';

describe('PublicPromptsComponent', () => {
  let component: PublicPromptsComponent;
  let fixture: ComponentFixture<PublicPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPromptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
