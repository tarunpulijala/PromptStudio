import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPromptsComponent } from './my-prompts.component';

describe('MyPromptsComponent', () => {
  let component: MyPromptsComponent;
  let fixture: ComponentFixture<MyPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPromptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
