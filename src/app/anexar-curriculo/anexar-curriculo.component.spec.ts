import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexarCurriculoComponent } from './anexar-curriculo.component';

describe('AnexarCurriculoComponent', () => {
  let component: AnexarCurriculoComponent;
  let fixture: ComponentFixture<AnexarCurriculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnexarCurriculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnexarCurriculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
