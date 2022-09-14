import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { CaracteristicasService } from '../cadastro-express/caracteristicas-service';
import { forEach } from '@angular/router/src/utils/collection';
import { MatRadioChange } from '@angular/material';
import { Observable, Subscription, timer } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-abrir-provas',
  templateUrl: './abrir-provas.component.html',
  styleUrls: ['./abrir-provas.component.scss'],
})
export class AbrirProvasComponent implements OnInit {
  provaPerguntas;
  provaPerguntasAux;
  titulo: string;
  descricao: string;
  botoes;
  modal;
  nomeprova;
  dataprova;
  notaprova;
  prova: string;
  selected = -1;
  perguntaAtual: any = [];
  quantPerguntas = 0;
  alternativa: any;
  candidato: any = {};

  respPortugues = {};
  respMatematica = {};
  respLogica = {};
  respIngles = {};
  respExcel = {};
  respRaciocinio = {};
  respAvaliacao = {};

  respostasProva = {
    CandidatoId: '',
    Tipo: '',
    Inicio: null,
    Fim: null,
    Perguntas: [],
  };

  private subscription: Subscription;
  @Output() TimerExpired: EventEmitter<any> = new EventEmitter<any>();
  @Input() SearchDate: moment.Moment = moment();
  @Input() ElapsTime = 20;

  searchEndDate: moment.Moment;
  remainingTime: number;
  minutes: number;
  seconds: number;
  everySecond: Observable<number> = timer(0, 1000);

  // tslint:disable-next-line:max-line-length
  constructor(
    public caracteristicasService: CaracteristicasService,
    private dialogRef: MatDialogRef<AbrirProvasComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private ref: ChangeDetectorRef
  ) {
    this.carregarDados();

    this.titulo = data.titulo;
    this.descricao = data.descricao;
    this.botoes = data.botoes;
    this.prova = data.prova;
    this.modal = data.modal;
    this.nomeprova = data.nomeprova;
    this.dataprova = data.dataprova;
    this.notaprova = data.notaprova;

    this.searchEndDate = this.SearchDate.add(this.ElapsTime, 'minutes');

    this.caracteristicasService.postProvas(this.prova).subscribe((response) => {
      this.quantPerguntas = 0;
      let count = 1;
      // console.log(response);
      this.provaPerguntas = response;
      this.provaPerguntas.Perguntas.forEach((pergunta) => {
        pergunta.indice = count;
        count++;
        pergunta.Respostas.forEach((resposta) => {
          // resposta['Letra'] = 'A';
          switch (resposta.Sequencial) {
            case 1:
              resposta.Letra = 'A';
              break;
            case 2:
              resposta.Letra = 'B';
              break;
            case 3:
              resposta.Letra = 'C';
              break;
            case 4:
              resposta.Letra = 'D';
              break;
            case 5:
              resposta.Letra = 'E';
              break;
          }
        });
      });

      this.perguntaAtual = this.provaPerguntas.Perguntas[0];
      this.quantPerguntas = this.provaPerguntas.Perguntas.length;
    });
  }

  ngOnInit() {
    this.subscription = this.everySecond.subscribe((seconds) => {
      const currentTime: moment.Moment = moment();
      this.remainingTime = this.searchEndDate.diff(currentTime);
      this.remainingTime = this.remainingTime / 1000;

      if (this.remainingTime <= 0) {
        this.SearchDate = moment();
        this.searchEndDate = this.SearchDate.add(this.ElapsTime, 'minutes');

        this.TimerExpired.emit();
        alert(
          'O tempo para responder a prova terminou, por favor reinicie o preenchimento do mesmo.'
        );
        this.dialogRef.close();
      } else {
        this.minutes = Math.floor(this.remainingTime / 60);
        this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
      }
      this.ref.markForCheck();
    });

    this.respostasProva = {
      CandidatoId: this.candidato.userInternalId,
      Tipo: this.prova,
      Inicio: new Date(),
      Fim: '',
      Perguntas: [],
    };
  }

  carregarDados() {
    this.caracteristicasService.getCadastroDTO().subscribe((cadastro) => {
      this.candidato = cadastro;
      this.caracteristicasService
          .getCandidatoProvas(this.candidato.userInternalId, this.prova)
          .subscribe(
            (prova) => {
            },
            (erro) => {
              if (erro.status == 404) {
                // console.log('erro 404');
              }
            }
          );
    });
  }

  proximaPergunta(indice) {
    if (this.alternativa == null) {
      if (indice < this.provaPerguntas.Perguntas.length) {
        alert('Selecione uma resposta para prosseguir!');
      } else {
        alert('Não existem mais perguntas posteriores a esta nesta prova!');
      }
    } else {
      this.alternativa = null;
      if (indice < this.provaPerguntas.Perguntas.length) {
        this.perguntaAtual = this.provaPerguntas.Perguntas[indice];
      } else {
        alert('Não existem mais perguntas posteriores a esta nesta prova!');
      }
    }
  }

  finalizarProva(tipo) {
    this.respostasProva.CandidatoId = this.candidato.userInternalId;
    this.respostasProva.Fim = new Date();
    this.respostasProva.Tipo = tipo;
    this.respostasProva.Perguntas = [];

    switch (tipo) {
      case 1: // portugues
        this.montarJson(this.respPortugues);
        break;

      case 2: // matematica
        this.montarJson(this.respMatematica);
        break;

      case 3: // logica
        this.montarJson(this.respLogica);
        break;

      case 4: // ingles
        this.montarJson(this.respIngles);
        break;

      case 5: // raciocinio
        this.montarJson(this.respRaciocinio);
        break;

      case 6: // excel
        this.montarJson(this.respExcel);
        break;

      case 7: // avaliacao
        this.montarJson(this.respAvaliacao);
        break;
    }
    alert('Prova Finalizada!');
    // console.log('RESPOSTAS AQUI', this.respostasProva);
    this.caracteristicasService
      .postCandidatoProva(this.candidato.userInternalId, this.respostasProva)
      .subscribe((result) => {
        this.dialogRef.close();
      });
    // close();
  }

  montarJson(respSelecionadas) {
    // console.log(this.provaPerguntasAux);
    for (const index of Object.keys(respSelecionadas)) {
      const numPergunta = Number(index.replace(/^\D+/g, ''));
      const pergunta = this.provaPerguntas.Perguntas[numPergunta - 1];
      // const respostasAll = this.provaPerguntas.Perguntas[index].Respostas;
      const respostaCandidato = respSelecionadas[index];
      delete respostaCandidato.Letra;
      delete respostaCandidato.ID;
      delete respostaCandidato.ProvaPerguntaID;

      this.respostasProva.Perguntas.push({
        // CandidatoProvaID: 7,
        Nivel: pergunta.Nivel,
        Descricao: pergunta.Descricao,
        RespostaEsperada: pergunta.RespostaEsperada,
        RespostaEfetuada: respostaCandidato.Sequencial,
        Respostas: pergunta.Respostas,
      });
    }
  }

  onItemChange(event: MatRadioChange, perguntaTipo, selecionado) {
    // console.log(perguntaTipo, selecionado, event.value, event.source.name);

    switch (perguntaTipo) {
      case 1: // portugues
        this.respPortugues[event.source.name] = selecionado;
        break;

      case 2: // matematica
        this.respMatematica[event.source.name] = selecionado;
        break;

      case 3: // logica
        this.respLogica[event.source.name] = selecionado;
        break;

      case 4: // ingles
        this.respIngles[event.source.name] = selecionado;
        break;

      case 5: // raciocinio
        this.respRaciocinio[event.source.name] = selecionado;
        break;

      case 6: // excel
        this.respExcel[event.source.name] = selecionado;
        break;

      case 7: // avaliacao
        this.respAvaliacao[event.source.name] = selecionado;
        break;
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
