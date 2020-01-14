import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddusermodalComponent } from './addusermodal.component';

describe('AddusermodalComponent', () => {
  let component: AddusermodalComponent;
  let fixture: ComponentFixture<AddusermodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddusermodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddusermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
