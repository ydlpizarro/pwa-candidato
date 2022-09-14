import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvasComponent } from './provas.component';

describe('ProvasComponent', () => {
  let component: ProvasComponent;
  let fixture: ComponentFixture<ProvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
