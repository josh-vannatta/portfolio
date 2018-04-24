import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortolioListComponent } from './portolio-list.component';

describe('PortolioListComponent', () => {
  let component: PortolioListComponent;
  let fixture: ComponentFixture<PortolioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortolioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortolioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
