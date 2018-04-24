import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicArrayComponent } from './dynamic-array.component';

describe('DynamicArrayComponent', () => {
  let component: DynamicArrayComponent;
  let fixture: ComponentFixture<DynamicArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
