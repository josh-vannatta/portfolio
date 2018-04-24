import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveThesisComponent } from './interactive-thesis.component';

describe('InteractiveThesisComponent', () => {
  let component: InteractiveThesisComponent;
  let fixture: ComponentFixture<InteractiveThesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveThesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveThesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
