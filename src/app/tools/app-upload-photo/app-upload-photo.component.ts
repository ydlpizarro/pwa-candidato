import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { environment } from '../../../environments/environment';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DialogComponent } from '../../tools/dialog/dialog.component';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './app-upload-photo.component.html',
  styleUrls: ['./app-upload-photo.component.scss']
})
export class AppUploadPhotoComponent implements OnInit {

  // cadastroExpress.get('imagemPerfil')
  @Input() imagemPerfil;

  private imageChangedEvent: any = '';
  private croppedImage: any = '';
  private croppedImageFile: any = '';
  public imagemUrl: string = '';

  uploader: FileUploader;

  constructor(public dialog: MatDialog) {
    this.imagemUrl = environment.serverURL + 'novo-candidato/assets/img/placeholder-foto-profile.jpg';
    const authorizationData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    const token = authorizationData ? authorizationData.token : undefined;
    this.uploader = new FileUploader({
      url: environment.serverURL + 'api/upload/UploadFoto',
      disableMultipart : false,
      autoUpload: true,
      method: 'post',
      itemAlias: 'attachment',
      allowedFileType: ['png, jpg', 'jpge', 'gif'],
      authTokenHeader:  'authorization',
      authToken: 'Bearer ' + token,
      maxFileSize: 3 * 1024 * 1024
    });
  }

  ngOnInit() {
    this.uploader.onBeforeUploadItem = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('FileUpload:uploaded:', item, status, response);

      if (status === 200) {
        this.imagemPerfil = response + '?v=' + new Date().getTime();
      } else {
        this.dialog.open(DialogComponent, {
          data: {
            titulo:    'Dispositivo Offline!',
            descricao: 'Ocorreu um erro ao enviar atualizar sua foto! Por favor tente novamente mais tarde.',
            botoes:     [{color: 'accent', texto: 'Ok', funcao: 'fechar'}]
          }
        });
      }
    };
  }

  openModalImagePerfil(templateRef: TemplateRef<any>) {
    const modal = this.dialog.open(templateRef, {});

    modal.afterClosed().subscribe(resultado => {
      if (resultado) {
        // console.log('upload');

        let arquivoBlob = this.converterBlobEmFileItem(this.croppedImageFile);
        this.uploader.queue.push(arquivoBlob);
        arquivoBlob.upload();
      }
    });
  }

  private converterBlobEmFileItem(blobImage) {
    let blob: Blob = new Blob([blobImage]);
    let fileFromBlob     = new File([blob], new Date().valueOf() + "-" + blobImage.size + ".png");
    let fileItemFromFile = new FileItem(this.uploader, fileFromBlob, {});
    // console.log(fileItemFromFile);

    return fileItemFromFile;
  }

  fileChangeEvent(event: any) {
    // console.log("change");
    this.imageChangedEvent = event;

  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedImageFile = event.file;
    // console.log('cropped');
  }
  imageLoaded() {
    // console.log("loaded");
    // show cropper
  }
  cropperReady() {
    // console.log("cropper");
    // cropper ready
  }
  loadImageFailed() {
    // console.log("failed");
    // show message
  }
}
