import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSchoolComponent } from './create-school.component';

describe('CreateSchoolComponent', () => {
  let component: CreateSchoolComponent;
  let fixture: ComponentFixture<CreateSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
