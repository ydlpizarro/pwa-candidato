import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroExpressComponent } from './cadastro-express.component';

describe('CadastroExpressComponent', () => {
  let component: CadastroExpressComponent;
  let fixture: ComponentFixture<CadastroExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

