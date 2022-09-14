import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUploadPhotoComponent } from './app-upload-photo.component';

describe('AppUploadPhotoComponent', () => {
  let component: AppUploadPhotoComponent;
  let fixture: ComponentFixture<AppUploadPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUploadPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUploadPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
