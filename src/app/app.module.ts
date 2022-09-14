import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {NgxMaskModule, } from 'ngx-mask';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpConfigInterceptor} from './interceptor/httpconfig.interceptor';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroExpressComponent } from './cadastro-express/cadastro-express.component';
import { HeaderContentComponent } from './header-content/header-content.component';
import {CaracteristicasService} from './cadastro-express/caracteristicas-service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FileUploadModule } from 'ng2-file-upload';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { LoaderComponent } from './tools/loader/loader.component';
import {LoaderService} from './tools/loader.service';
import { PreventEnterSubmitDirective } from './tools/prevent-enter-submit.directive';
import { DialogComponent } from './tools/dialog/dialog.component';
import { DateMaskInputDirective } from './tools/date-mask-input-directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppUploadCvComponent } from './tools/app-upload-cv/app-upload-cv.component';
import { AppUploadPhotoComponent } from './tools/app-upload-photo/app-upload-photo.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ReplacePipe } from './tools/replace.pipe';
import {VagaService} from './service/vaga-service';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { InventarioComportamentalComponent } from './inventario-comportamental/inventario-comportamental.component';
import { AnexarCurriculoComponent } from './anexar-curriculo/anexar-curriculo.component';
import { ProvasComponent } from './provas/provas.component';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import { NgxSpinnerModule } from "ngx-spinner";
import { AbrirProvasComponent } from './abrir-provas/abrir-provas.component';

@NgModule({
    declarations: [
      AppComponent,
      CadastroExpressComponent,
      HeaderContentComponent,
      FooterComponent,
      DashboardComponent,
      LoaderComponent,
      PreventEnterSubmitDirective,
      DateMaskInputDirective,
      DialogComponent,
      AppUploadCvComponent,
      AppUploadPhotoComponent,
      ReplacePipe,
      ProgressbarComponent,
      BreadcrumbComponent,
      InventarioComportamentalComponent,
      AnexarCurriculoComponent,
      ProvasComponent,
      AbrirProvasComponent,
  ],
  imports: [
    HttpClientModule,
    NgxMaskModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    LayoutModule,
    NgxDocViewerModule,
    NgxSpinnerModule,
    FileUploadModule,
    ImageCropperModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    CaracteristicasService,
    LoaderService,
    VagaService,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  entryComponents: [
    DialogComponent,
    AbrirProvasComponent

  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
