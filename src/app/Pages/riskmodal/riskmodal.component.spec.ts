import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskmodalComponent } from './riskmodal.component';

describe('RiskmodalComponent', () => {
  let component: RiskmodalComponent;
  let fixture: ComponentFixture<RiskmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
