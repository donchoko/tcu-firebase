import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionReportComponent } from './section-report.component';

describe('SectionReportComponent', () => {
  let component: SectionReportComponent;
  let fixture: ComponentFixture<SectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
