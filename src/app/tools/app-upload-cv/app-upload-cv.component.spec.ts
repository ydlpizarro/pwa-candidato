import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUploadCvComponent } from './app-upload-cv.component';

describe('AppUploadCvComponent', () => {
  let component: AppUploadCvComponent;
  let fixture: ComponentFixture<AppUploadCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUploadCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUploadCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
