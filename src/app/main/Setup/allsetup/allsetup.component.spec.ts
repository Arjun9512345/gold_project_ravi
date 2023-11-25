import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllsetupComponent} from './allsetup.component';

describe('AllsetupComponent', () => {
  let component: AllsetupComponent;
  let fixture: ComponentFixture<AllsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllsetupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
