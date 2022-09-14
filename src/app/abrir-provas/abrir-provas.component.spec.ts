import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbrirProvasComponent } from './abrir-provas.component';

describe('AbrirProvasComponent', () => {
  let component: AbrirProvasComponent;
  let fixture: ComponentFixture<AbrirProvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbrirProvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbrirProvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
