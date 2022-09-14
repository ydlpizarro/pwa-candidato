import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../tools/dialog/dialog.component';

@Component({
  selector: 'app-upload-cv',
  templateUrl: './app-upload-cv.component.html',
  styleUrls: ['./app-upload-cv.component.scss']
})
export class AppUploadCvComponent implements OnInit {

  // cadastroExpress.get('arquivoCV')
  @Input() curriculo;

  // upload do currículo
  uploader: FileUploader;

  constructor(public dialog: MatDialog) {
    const authorizationData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    const token = authorizationData ? authorizationData.token : undefined;
    this.uploader = new FileUploader({
      url: environment.serverURL + 'api/upload/UploadCV',
      disableMultipart : false,
      autoUpload: true,
      method: 'post',
      itemAlias: 'attachment',
      allowedFileType: ['doc', 'pdf', 'docx', 'txt'],
      authTokenHeader:  'authorization',
      authToken: 'Bearer ' + token,
      maxFileSize: 3 * 1024 * 1024
    });
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        console.log('FileUpload:uploaded:', item, status, response);

        if (status === 200) {
          this.dialog.open(DialogComponent, {
            data: {
              titulo:    'Enviado com sucesso!',
              descricao: 'Seu currículo foi enviado com sucesso!',
              botoes:     [{color: 'accent', texto: 'Ok', funcao: 'fechar'}]
            }
          });
        } else {
          console.log(item, status, response);
          this.dialog.open(DialogComponent, {
            data: {
              titulo:    'Dispositivo Offline!',
              descricao: 'Ocorreu um erro ao enviar o seu currículo! Por favor tente novamente mais tarde.',
              botoes:     [{color: 'accent', texto: 'Ok', funcao: 'fechar'}]
            }
          });
        }
     };
  }

  downCurriculo(url) {
    window.open(url, '_blank');
    console.log(url);
  }
}
