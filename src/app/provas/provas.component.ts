import { Component, OnInit } from '@angular/core';
import { AbrirProvasComponent } from '../abrir-provas/abrir-provas.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CaracteristicasService } from '../cadastro-express/caracteristicas-service';
import { VagaService } from '../service/vaga-service';
import { ActivatedRoute } from '@angular/router';
import { IdbKeyvalService } from '../tools/indexedDB/idb-keyval.service';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from '../tools/dialog/dialog.component';
import { Router, NavigationEnd } from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-provas',
  templateUrl: './provas.component.html',
  styleUrls: ['./provas.component.scss'],
})
export class ProvasComponent implements OnInit {
  cadastroExpress: FormGroup;
  mensagemErroAoValidarCodigoFuncionario = '';
  provaPerguntas;
  provas: any;
  candidato: any;
  nomeProva: any[] = [];
  statusProva: any[] = [];
  vagaProva:any[]=[];
  parametros: IParametrosBackEnd;
  vaga;
  allExams: any[] = [];
  showProvaNota: any[] = [];
  showDataProva: any[] = [];
  statusModal: any;
  contador = 0;
  laudoDom;

  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    public caracteristicasService: CaracteristicasService,
    private vagaService: VagaService,
    private route: ActivatedRoute,
    private idb: IdbKeyvalService,
    private router: Router
  ) {
    this.provas = [
      { nomeDaProva: 'Português', chave: 1, name: 1 },
      { nomeDaProva: 'Matemática', chave: 2, name: 2 },
      { nomeDaProva: 'Lógica', chave: 3, name: 3 },
      { nomeDaProva: 'Inglês', chave: 4, name: 4 },
      { nomeDaProva: 'Raciocínio Analítico', chave: 5, name: 5 },
      { nomeDaProva: 'Excel', chave: 6, name: 6 },
      { nomeDaProva: 'Avaliação de Competência', chave: 7, name: 7 },
    ];

    // console.log(this.provas);
  }
  ngOnInit() {
    this.carregarDados();
    const local = localStorage.getItem('ls.parametros');
    // console.log(local);
    const params = JSON.parse(local);
    if (params) {
    if ('vagaId' in params) {
      this.parametros = params;
      this.carregarVaga();
    }
    console.log('saida params provas:',params)
  }

    this.caracteristicasService.refreshNeesded$.subscribe(() => {
      this.carregarDados();
    });
    // this.carregarDados();
  }

  abrirProvas(tipo) {
    this.nomeProva = [
      'Português',
      'Matemática',
      'Lógica',
      'Inglês',
      'Raciocínio Analítico',
      'Excel',
      'Avaliação de Competência',
    ];

    this.dialog.open(AbrirProvasComponent, {
      data: {
        titulo: 'Prova de ' + this.nomeProva[tipo - 1],
        // tslint:disable-next-line:max-line-length
        botoes: [],
        prova: tipo,
        modal: this.statusProva[tipo - 1],
        nomeprova: this.nomeProva[tipo - 1],
        notaprova: this.showProvaNota[tipo - 1],
        dataprova: this.showDataProva[tipo - 1]
      },
    });
  }

  carregarDados() {
    this.caracteristicasService.carregarLaudoDom().subscribe((data)=>{
      this.laudoDom=data;
    });

    this.caracteristicasService.getCadastroDTO().subscribe((cadastro) => {
      this.spinner.show();
      this.cadastroExpress = cadastro;
      this.candidato = cadastro;
      this.contador =0;
      for (let i = 1; i <= 5; i++) {
        this.caracteristicasService
          .getCandidatoProvas(this.candidato.userInternalId, i)
          .subscribe(
            (prova) => {
              if (prova) {
                if (this.allExams) {

                  Object.assign(this.allExams, prova);
                } else {
                  this.allExams.push(prova);
                }
                this.statusProva[i - 1] = 'OK';
                this.showProvaNota[i - 1] = prova['Nota'] / 10;
                this.showDataProva[i - 1] = prova['Fim'];
              } else {
                this.statusProva[i - 1] = 'EMPTY';
              }
              this.contador++;
              if(this.contador==5){
                this.spinner.hide();
              }
            },
            (erro) => {
              if (erro.status == 404) {
                this.statusProva[i - 1] = 'EMPTY';
                this.contador++;
              }
              if (erro.status == 500) {
                this.statusProva[i - 1] = 'SERVER';
                this.contador++;
              }
              if(this.contador==5){
                this.spinner.hide();
              }
            }
            
          );
          
      }
      // this.spinner.hide();
      // console.log(this.allExams);
    });
  }

  salvar() {
    if (window.navigator.onLine) {
      if (this.parametros != undefined && !(this.parametros.vagaId == null) &&!(this.laudoDom ==null)) {
        this.vagaService.realizarCandidaturaVagaComParametros(this.parametros)
        .subscribe(vaga => {
            this.vagaService.rodarEngineParaAnalisarPerfil(this.parametros.vagaId, this.candidato.userInternalId)
            .subscribe(value => {
                localStorage.setItem('ls.parametros', JSON.stringify(this.parametros));
                localStorage.setItem("ls.vagaId", this.parametros.vagaId);
                alert('Dados salvos com sucesso!');
                window.location.href = '/candidato/#/dashboard';
            },error =>  {
              window.location.href = '/candidato/#/dashboard';
            }
            );
        },
        error =>  {
            this.mensagemErroAoValidarCodigoFuncionario = error.error;
            alert('Error')
            window.location.href = '/candidato/#/dashboard';
        });


        

      } else if(this.parametros != undefined && !(this.parametros.vagaId == null) && (this.laudoDom ==null)) {   
        
        this.vagaService.getVaga(this.parametros.vagaId).subscribe((vaga) => {
          if(vaga){
            this.vaga=vaga;
            let titulo=this.vaga.Part.nome
            
            let descricaoErro='inventario'
            if(!this.verificarDOM(vaga)){
              this.mostrarDialogProblem(descricaoErro,titulo);              
            }else{
              alert('Candidatura feita com sucesso')
              window.location.href = '/candidato/#/dashboard';

            }

          }        
        })
      }else{
        window.location.href = '/candidato/#/dashboard';
      }
    } else {
      this.idb
        .setItem('candidato', this.cadastroExpress.value)
        .then((result) => {
          this.idb.setItem('offline', true);

          let desc =
            'Desculpe, mas não foi possível atualizar seus dados no momento. ';
          if (result) {
            desc +=
              'Suas alterações serão salvas neste dispositivo e enviados quando estiver online.';
            this.mostrarDialogOffline(desc);
          } else {
            desc +=
              'Ocorreu um erro ao registrar suas informações neste dispositivo.';
            this.mostrarDialogOffline(desc);
            // console.log(result);
          }
        });
    }
  }
  getParametrosBackEnd(params): IParametrosBackEnd {
    return {
      vagaId: params.vagaId,
      redirect: params.redirect,
      origem: params.origem,
      midiaCampanha: params.midiaCampanha,
      nomeCampanha: params.nomeCampanha,
      codigoIndicacaoDoFuncionario: '',
    };
  }

  private carregarVaga() {
    this.vagaService.getVaga(this.parametros.vagaId).subscribe((vaga) => {
      this.vaga = vaga;
      this.vagaProva.push(this.vaga.Part.aplicarPortugues)
      this.vagaProva.push(this.vaga.Part.aplicarMatematica)
      this.vagaProva.push(this.vaga.Part.aplicarLogica)
      this.vagaProva.push(this.vaga.Part.aplicarIngles)
      this.vagaProva.push(this.vaga.Part.aplicarRaciocinioAnalitico)
      this.vagaProva.push(false)
      this.vagaProva.push(false)
    });
  }
  mostrarDialogOffline(descritivo) {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Dispositivo Offline!',
        descricao: descritivo,
        botoes: [{ color: 'accent', texto: 'Ok', funcao: 'fechar' }],
      },
    });
  }
  verificarDOM(vaga){
    if(vaga){
      if(vaga.Part.skillLideranca==null&&vaga.Part.skillEmpreendedorismo==null&&vaga.Part.skillComunicacao==null
        &&vaga.Part.skillArgumentacao==null&&vaga.Part.skillVelocidade==null&&vaga.Part.skillPraticidade==null
        &&vaga.Part.skillDetalhe==null&&vaga.Part.skillOrganizacao==null&&vaga.Part.skillCumprimentoNormas==null
        &&vaga.Part.skillPercepcao==null&&vaga.Part.skillIntuicao==null&&vaga.Part.skillCriticidade==null
        &&vaga.Part.skillDecisaoRacional==null&&vaga.Part.skillCriatividade==null&&vaga.Part.skillEnergia==null
        ){
          console.log('todos sao null')
          return true
        }else{
          return false
        }
    }else{
      return true
    }
  }
  mostrarDialogProblem(descritivo,titulo) {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: titulo,
        descricao: descritivo,
        botoes: [{ color: 'accent', texto: 'Ok', funcao: ['confirmacao','fechar'] }],
      },
    });
  }
}
