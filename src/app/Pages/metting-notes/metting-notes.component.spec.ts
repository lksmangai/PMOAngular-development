import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MettingNotesComponent } from './metting-notes.component';

describe('MettingNotesComponent', () => {
  let component: MettingNotesComponent;
  let fixture: ComponentFixture<MettingNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MettingNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MettingNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
