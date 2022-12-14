import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CaracteristicasService} from '../cadastro-express/caracteristicas-service';
import {CpfValidator} from '../cadastro-express/cpf-validator';
import {Router, NavigationEnd} from '@angular/router';
import {DialogComponent} from '../tools/dialog/dialog.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-inventario-comportamental',
  templateUrl: './inventario-comportamental.component.html',
  styleUrls: ['./inventario-comportamental.component.scss']
})

export class InventarioComportamentalComponent implements OnInit {
  inventarioComportamental: FormGroup;
  perguntas = {alternativas: []};
  laudo;
  errorMsgIdade = '';
  errorMsgAlternativas = '';

  constructor(private formBuilder: FormBuilder, public caracteristicasService: CaracteristicasService, private router: Router, public dialog: MatDialog) {
    this.inventarioComportamental = this.formBuilder.group({
      nome: ['', Validators.required],
      cargo: ['', Validators.required],
      cpf: ['', [ Validators.required, CpfValidator.isValidCpf() ]],
      dataNascimento: ['', Validators.required],
      celular: ['', Validators.required],
      sexo: ['', Validators.required],
      alternativas: [[]]
    });

    this.getAlternativas();
  }

  ngOnInit() {
    this.carregarLaudoDom();
    console.log(this.carregarLaudoDom());

    // localStorage.setItem('ls.parametros', JSON.stringify(this.parametros));
    let parametros = localStorage.getItem("ls.parametros");
    console.log('saida params inventarioComportamental',parametros);
  

    this.carregarDados();
    console.log(this.carregarDados());

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }


  carregarDados() {
    this.caracteristicasService.getCadastroDTO()
      .subscribe(cadastro => {
        // console.log(cadastro);
        this.inventarioComportamental.get('nome').setValue(cadastro.nomeCompleto);
        this.inventarioComportamental.get('cargo').setValue(cadastro.perfilProfissional);
        this.inventarioComportamental.get('dataNascimento').setValue(cadastro.dataNascimento);
        this.inventarioComportamental.get('cpf').setValue(cadastro.cpf);
        this.inventarioComportamental.get('celular').setValue(cadastro.contato);
        this.inventarioComportamental.get('sexo').setValue(this.retornarGenero(cadastro));
      });
  }

  carregarLaudoDom() {
    this.caracteristicasService.carregarLaudoDom()
      .subscribe(laudo => {
        console.log(laudo);
        this.laudo = laudo;
      });
  }

  retornarGenero(cadastro) {
    if (cadastro.sexo) {
      if (cadastro.sexo.Descricao === 'Masculino') {
        return 'M';
      }
      if (cadastro.sexo.Descricao === 'Feminino') {
        return 'F';
      }
    }
  }

  validarAlternativas(alternativas) {
    if (alternativas.length < 11) {
      this.errorMsgAlternativas = 'Selecione ao menos 11 alternativas';
      return false;
    } else {
      this.errorMsgAlternativas = '';
      return true;
    }
  }

  maiorDezesseisAnos(nasc) {
    if (nasc === undefined) {
      return false;
    }

    const anoNasc  = nasc.getFullYear();
    const anoAtual = new Date().getFullYear();

    if ((anoAtual - anoNasc) <= 16) {
      this.errorMsgIdade = 'Somente maiores de 16 anos podem preencher o formul??rio comportamental.';
      return false;
    } else {
      this.errorMsgIdade = '';
      return true;
    }
  }

  salvarEcontinuar() {
    const dados = this.inventarioComportamental.value;
    const dataNasc = new Date(this.inventarioComportamental.get('dataNascimento').value);
    dados.dataNascimento = dataNasc.getDate() + '/' + (dataNasc.getMonth() + 1) + '/' + dataNasc.getFullYear();
    console.log(dados);

    console.log(this.inventarioComportamental.get('alternativas'));
    if (this.maiorDezesseisAnos(dataNasc) && this.validarAlternativas(dados.alternativas)) {
      if (this.inventarioComportamental.valid) {
        this.caracteristicasService.enviarRespostaDom(dados)
          .subscribe(result => {
            console.log(result);
            this.laudo = result;
            alert('Dados salvos com sucesso!');
            this.router.navigate([ '/anexar-curriculo' ]);
            // window.location.reload();
          });
      }
    }
  }

  salvar() {
    const dados = this.inventarioComportamental.value;
    const dataNasc = new Date(this.inventarioComportamental.get('dataNascimento').value);
    dados.dataNascimento = dataNasc.getDate() + '/' + (dataNasc.getMonth() + 1) + '/' + dataNasc.getFullYear();
    console.log(dados);

    console.log(this.inventarioComportamental.get('alternativas'));
    if (this.maiorDezesseisAnos(dataNasc) && this.validarAlternativas(dados.alternativas)) {
      if (this.inventarioComportamental.valid) {
        this.caracteristicasService.enviarRespostaDom(dados)
          .subscribe(result => {
            console.log(result);
            this.laudo = result;
            alert('Dados salvos com sucesso!');
            // window.location.reload();
          });
      }
    }
  }

  avancarEtapa() {
    this.router.navigate([ '/anexar-curriculo' ]);
  }


  adicionarPergunta(checkbox, item, texto) {
    const id = this.inventarioComportamental.get('alternativas').value.indexOf(item);
    // const descricao = this.inventarioComportamental.get('alternativas').value.indexOf(texto);

    const objeto={'id':item,
      'texto':texto};

    if (id > -1) {
      // this.inventarioComportamental.get('alternativas').value.splice(id, 1);
      // this.inventarioComportamental.get('alternativas').value.splice(descricao, 1);
      this.inventarioComportamental.get('alternativas').value.splice(objeto,1);
    } else {
      // this.inventarioComportamental.get('alternativas').value.push(item);
      // this.inventarioComportamental.get('alternativas').value.push(texto);
      this.inventarioComportamental.get('alternativas').value.push(objeto);
    }
    console.log(this.inventarioComportamental.get('alternativas').value);
    console.log(objeto);
  }

  getAlternativas() {

    this.perguntas = {
      alternativas: [{
        id: '1',
        texto: 'Trabalhar com um l??der que expressa praticidade'
      }, {
        id: '2',
        texto: 'Trabalhar com l??der que expressa organiza????o e estrutura'
      }, {
        id: '3',
        texto: 'Atender suas pr??prias convic????es'
      }, {
        id: '4',
        texto: 'Atender suas pr??prias reflex??es'
      }, {
        id: '5',
        texto: 'Desenvolver e despertar no outro sua capacidade intelectual'
      }, {
        id: '6',
        texto: 'Opinar sobre as diretrizes a serem seguidas'
      }, {
        id: '7',
        texto: 'Poder dividir com algu??m seus questionamentos'
      }, {
        id: '8',
        texto: 'Pautar sua rotina com disciplina e organiza????o'
      }, {
        id: '9',
        texto: 'Poder ser organizado e ter perspectivas'
      }, {
        id: '10',
        texto: 'Ter perspectivas e receber elogios'
      }, {
        id: '11',
        texto: 'Assumir cargos de destaque'
      }, {
        id: '12',
        texto: 'Poder responder de forma criativa aos est??mulos que recebe'
      }, {
        id: '13',
        texto: 'Trabalhar com determina????o'
      }, {
        id: '14',
        texto: 'Aconselhar'
      }, {
        id: '15',
        texto: 'Ensinar'
      }, {
        id: '16',
        texto: 'Buscar conhecimento mais profundo'
      }, {
        id: '17',
        texto: 'Buscar conhecimento interior'
      }, {
        id: '18',
        texto: 'Utilizar sua energia de forma racional'
      }, {
        id: '19',
        texto: 'Utilizar a diplomacia'
      }, {
        id: '20',
        texto: 'Esperar lhe causa impaci??ncia'
      }, {
        id: '21',
        texto: 'Esperar mesmo que se sinta ansioso'
      }, {
        id: '22',
        texto: 'Ter oportunidade para aprender'
      }, {
        id: '23',
        texto: 'Sentir-se seguro'
      }, {
        id: '24',
        texto: 'Investigar e desvendar caminhos ainda n??o percorridos'
      }, {
        id: '25',
        texto: 'Encontrar solu????es para situa????es dif??ceis'
      }, {
        id: '26',
        texto: 'Dar sequ??ncia aos trabalhos que desenvolveu'
      }, {
        id: '27',
        texto: 'Expressar-se de maneira franca e direta'
      }, {
        id: '28',
        texto: 'Trabalhar com profissionais otimistas'
      }, {
        id: '29',
        texto: 'N??o executar trabalhos rotineiros'
      }, {
        id: '30',
        texto: 'Atuar em cargos que permitam autonomia'
      }, {
        id: '31',
        texto: 'Ensinar, treinar, apoiar e desenvolver sua equipe'
      }, {
        id: '32',
        texto: 'Ter tempo para pensar e ponderar antes de agir'
      }, {
        id: '33',
        texto: 'Dividir com seus pares assuntos amb??guos'
      }, {
        id: '34',
        texto: 'Ater-se aos grandes fatos e n??o aos detalhes'
      }, {
        id: '35',
        texto: 'Trabalhar para um l??der atencioso'
      }, {
        id: '36',
        texto: 'Ser conselheiro e incentivador'
      }, {
        id: '37',
        texto: 'Trabalhar com profissionais vision??rios e futuristas'
      }, {
        id: '38',
        texto: 'Receber elogios constantemente',
      }, {
        id: '39',
        texto: 'Trabalhar incansavelmente'
      }, {
        id: '40',
        texto: 'Ter independ??ncia e n??o precisar de aprova????o da chefia'
      }, {
        id: '41',
        texto: 'Concluir rapidamente, dos trabalhos mais simples aos mais complexos'
      }, {
        id: '42',
        texto: 'Buscar qualidade nos resultados'
      }, {
        id: '43',
        texto: 'Respeitar os prazos estabelecidos'
      }, {
        id: '44',
        texto: 'Ter controle das situa????es'
      }, {
        id: '45',
        texto: 'Ler, estudar, aprender'
      }, {
        id: '46',
        texto: 'N??o ser interrompido nos momentos de introspec????o'
      }, {
        id: '47',
        texto: 'Ter tranquilidade para cuidar de detalhes'
      }, {
        id: '48',
        texto: 'Ser popular, conhecido'
      }, {
        id: '49',
        texto: 'Poder fazer da equipe grandes amigos'
      }, {
        id: '50',
        texto: 'Viajar e conhecer lugares diferentes'
      }, {
        id: '51',
        texto: 'Desenvolver v??rios trabalhos ao mesmo tempo'
      }, {
        id: '52',
        texto: 'Ser reconhecido pelas metas atingidas'
      }, {
        id: '53',
        texto: 'Ter a certeza de que executou seu trabalho com perfei????o'
      }, {
        id: '54',
        texto: 'Ter liberdade para agir mesmo que cometa erros'
      }, {
        id: '55',
        texto: 'Ter controle de suas atividades'
      }, {
        id: '56',
        texto: 'Competir, mesmo correndo o risco de perder'
      }, {
        id: '57',
        texto: 'Destacar-se pelas suas id??ias'
      }, {
        id: '58',
        texto: 'Confiar em sua intui????o'
      }, {
        id: '59',
        texto: 'Desenvolver especializa????o'
      }, {
        id: '60',
        texto: 'Trabalhar para um l??der coerente em suas a????es'
      }, {
        id: '61',
        texto: 'Ter const??ncia em suas atividades'
      }, {
        id: '62',
        texto: 'Conhecer detalhadamente as suas tarefas'
      }, {
        id: '63',
        texto: 'Desenvolver sua equipe'
      }, {
        id: '64',
        texto: 'Desempenhar trabalhos que exijam paci??ncia'
      }, {
        id: '65',
        texto: 'Preservar ambientes amig??veis'
      }, {
        id: '66',
        texto: 'Ter tempo para introspec????o e an??lise'
      }, {
        id: '67',
        texto: 'Programar suas a????es'
      }, {
        id: '68',
        texto: 'Assumir novas oportunidades'
      }, {
        id: '69',
        texto: 'Contatar pessoas com frequ??ncia'
      }, {
        id: '70',
        texto: 'Buscar crescimento'
      }, {
        id: '71',
        texto: 'Organizar e estruturar seu trabalho'
      }, {
        id: '72',
        texto: 'Preocupar-se com detalhes'
      }, {
        id: '73',
        texto: 'Controlar para n??o executar as mesmas tarefas duas vezes'
      }, {
        id: '74',
        texto: 'Ser cr??tico com profissionais descuidados'
      }, {
        id: '75',
        texto: 'Trabalhar com processos estruturados'
      }, {
        id: '76',
        texto: 'Vender'
      }, {
        id: '77',
        texto: 'Entregar'
      }, {
        id: '78',
        texto: 'Expressar sentimentos sem transparecer suas emo????es'
      }, {
        id: '79',
        texto: 'Materializar suas id??ias e planos'
      }, {
        id: '80',
        texto: 'Racionalizar seu trabalho'
      }, {
        id: '81',
        texto: 'Descarregar sua energia em trabalhos bra??ais'
      }, {
        id: '82',
        texto: 'Ter autonomia, dos trabalhos mais simples aos mais complexos'
      }],
    };

  }

}
