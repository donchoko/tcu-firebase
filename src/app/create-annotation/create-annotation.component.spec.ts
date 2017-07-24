import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnnotationComponent } from './create-annotation.component';

describe('CreateAnnotationComponent', () => {
  let component: CreateAnnotationComponent;
  let fixture: ComponentFixture<CreateAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
