import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioComportamentalComponent } from './inventario-comportamental.component';

describe('InventarioComportamentalComponent', () => {
  let component: InventarioComportamentalComponent;
  let fixture: ComponentFixture<InventarioComportamentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioComportamentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioComportamentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
