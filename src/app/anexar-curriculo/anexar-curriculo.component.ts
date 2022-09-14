import { Component, OnInit } from '@angular/core';
import {CaracteristicasService} from '../cadastro-express/caracteristicas-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogComponent} from '../tools/dialog/dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {LoaderService} from '../tools/loader.service';

@Component({
  selector: 'app-anexar-curriculo',
  templateUrl: './anexar-curriculo.component.html',
  styleUrls: ['./anexar-curriculo.component.scss']
})
export class AnexarCurriculoComponent implements OnInit {
  anexarCurriculo: FormGroup;
  nomeCompleto;
  urlCurriculo;


  constructor(private formBuilder: FormBuilder, public caracteristicasService: CaracteristicasService, public loaderService: LoaderService, public dialog: MatDialog,
              private snackBar: MatSnackBar, private router: Router) {
    this.anexarCurriculo = this.formBuilder.group({
      urlCurriculo: [''],
      nomeCompleto: ['']
    });
  }

  ngOnInit() {
    let parametros = localStorage.getItem("ls.parametros");
    console.log('saida params anexar-curriculo',parametros);
    this.carregarDados();
  }

  carregarDados() {
    this.caracteristicasService.getCadastroDTO()
      .subscribe(curriculo => {
        console.log(curriculo);
        this.anexarCurriculo.get('urlCurriculo').setValue(curriculo.urlCurriculo);
        this.anexarCurriculo.get('nomeCompleto').setValue(curriculo.nomeCompleto);
        this.nomeCompleto = curriculo.nomeCompleto;
        this.urlCurriculo = curriculo.urlCurriculo;
      });
  }

  openAlertDialog() {
    // console.log(this.urlCurriculo);
    // this.loaderService.show();
    this.dialog.open(DialogComponent, {
      width: '120vw',
      data: {
        titulo: 'Currículo ',
        url: this.urlCurriculo,
        botoes:    [{color: 'accent', texto: 'Fechar', funcao: 'fechar'}]
      },
    });

  }

  salvar() {
    alert('Dados salvos com sucesso!');
  }

  salvarEcontinuar() {
    alert('Dados salvos com sucesso!');
    this.router.navigate([ '/provas' ]);
  }

}
