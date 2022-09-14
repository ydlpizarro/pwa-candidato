import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {CaracteristicasService} from '../../cadastro-express/caracteristicas-service';
import {LoaderService} from '../loader.service';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  provaPerguntas;
  titulo: string;
  descricao: string;
  botoes;
  viewer: string;

  constructor(public caracteristicasService: CaracteristicasService, public loaderService: LoaderService,private router: Router, private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) data) {

    this.titulo    = data.titulo;
    this.descricao = data.descricao;
    this.botoes    = data.botoes;
    this.viewer = data.url;
  }

  ngOnInit() {
    this.loaderService.show();
    this.loaderService.hide();
  }

  close() {
    this.dialogRef.close();
  }
  finalizar(){
    this.close()
    window.location.href = '/candidato/#/dashboard';
  }
  corrigir(){
    this.close()
    this.router.navigate([ '/inventario-comportamental' ]);
  }

}
