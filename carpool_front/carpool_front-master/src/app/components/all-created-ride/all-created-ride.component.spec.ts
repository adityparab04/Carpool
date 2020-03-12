import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCreatedRideComponent } from './all-created-ride.component';

describe('AllCreatedRideComponent', () => {
  let component: AllCreatedRideComponent;
  let fixture: ComponentFixture<AllCreatedRideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCreatedRideComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCreatedRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
