import {Component, Input, OnInit, ElementRef, ViewChild, TemplateRef} from '@angular/core';
import {MatCheckboxChange, MatChipInputEvent, MatDialog, MatSlideToggleChange } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { CpfValidator } from './cpf-validator';
import { HttpClient } from '@angular/common/http';
import {CaracteristicasService} from './caracteristicas-service';
import { environment } from '../../environments/environment';
import { DialogComponent } from '../tools/dialog/dialog.component';
import { SwUpdate } from '@angular/service-worker';
import { IdbKeyvalService } from '../tools/indexedDB/idb-keyval.service';
import {ActivatedRoute} from '@angular/router';
import {VagaService} from '../service/vaga-service';
import {Router, NavigationEnd } from '@angular/router';
import { UtilsService } from '../service/utils.service';

@Component({
    selector: 'app-cadastro-express',
    templateUrl: './cadastro-express.component.html',
    styleUrls: ['./cadastro-express.component.scss']
})

export class CadastroExpressComponent implements OnInit {
    cadastroExpress: FormGroup;
    indeterminate = false;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    competencias: FormArray;
    beneficios;
    listaAreaDeAtuacao;
    listaBeneficios;
    listaIdiomas;
    listaTiposContratacao;
    listaStatusFormacaoAcademica;
    listaDisponibilidadeViagem;
    listaDisponibilidadeMudanca;
    listaClusters;
    resumoProfissional: '';
    formacoes: FormArray;
    experiencias: FormArray;
    idiomas: FormArray;
    pcd: FormArray;
    semExperiencia = false;
    desabilitarCampoSemExperiencia = true;
    parametros: IParametrosBackEnd;
    vaga;
    mensagemErroAoValidarCodigoFuncionario: string = "";
    userInternalId = "";
    nivelIdioma = [];

    formDiversidade = {
        termoUsoAceito: false,
        pcd: [],
        genero: [],
    };

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        this.competencias = this.cadastroExpress.get('competencias') as FormArray;

        if ((value || '').trim()) {
            this.competencias.push(new FormControl(value.trim()));
        }

        if (input) {
            input.value = '';
        }
    }
    remove(value): void {
        const index = this.competencias.value.findIndex(competencia => competencia === value.value);

        if (index >= 0) {
            this.competencias.removeAt(index);
        }
    }

    constructor(private formBuilder: FormBuilder, http: HttpClient, public caracteristicasService: CaracteristicasService, public dialog: MatDialog, private swUpdate: SwUpdate, private idb: IdbKeyvalService, private route: ActivatedRoute, private vagaService: VagaService, private router: Router, private utils: UtilsService) {
        this.carregarNivelIdioma();

        this.caracteristicasService.getBeneficios()
        .subscribe(beneficios => {
            this.listaBeneficios = beneficios;
        });

        caracteristicasService.getAreaDeAtuacao()
        .subscribe(areasDeAtuacao => {
            this.listaAreaDeAtuacao =  areasDeAtuacao;
        });

        caracteristicasService.getIdiomas()
        .subscribe(idiomas => {
            this.listaIdiomas = idiomas;
        });

        caracteristicasService.getTipoContratacao()
        .subscribe(tiposContratacao => {
            this.listaTiposContratacao = tiposContratacao;
        });

        caracteristicasService.getStatusFormacaoAcademica()
        .subscribe(status => {
            this.listaStatusFormacaoAcademica = status;
        });

        caracteristicasService.getDisponibilidadeViagem()
        .subscribe(viagem => {
            this.listaDisponibilidadeViagem = viagem;
        });

        caracteristicasService.getDisponibilidadeMudanca()
        .subscribe(mudanca => {
            this.listaDisponibilidadeMudanca = mudanca;
        });

        caracteristicasService.getClusters()
        .subscribe(clusters => {
            this.listaClusters = clusters;
        })

        this.formDiversidade.pcd = utils.getTipoPcd();
        this.formDiversidade.genero = utils.getGenero();
    }

    ngOnInit(): void {
        console.log('PWA Update Enable: ', this.swUpdate.isEnabled);
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() => {
                if (confirm('Deseja receber as informações atualizadas?')) {
                    window.location.reload();
                }
            });
        }
        this.route.queryParams.subscribe(params => {
            if ('vagaId' in params) {
                this.parametros =  this.getParametrosBackEnd(params);
                this.carregarVaga();
            }
        });

        this.cadastroExpress = this.formBuilder.group({
            nomeCompleto: ['', Validators.required],
            pis: [''],
            rg: [''],
            dataExpedicaoRg: [''],
            orgaoEmissorRg: [''],
            urlFoto: [''],
            urlCurriculo: [''],
            codigoIndicacaoFuncionario: [''],
            dataNascimento: ['', Validators.required],
            cpf: ['', [ Validators.required, CpfValidator.isValidCpf() ]],
            contato: ['', Validators.required],
            perfilProfissional: ['', Validators.required],
            resumoProfissional: [''],
            perfil: this.createPerfil(),
            cep: ['', Validators.required],
            genero: [{value: '', disabled: true}],
            competencias: this.formBuilder.array([]),
            remuneracao: this.createRemuneracao(),
            experiencias: this.formBuilder.array([]),
            formacoes: this.formBuilder.array([]),
            beneficios: this.formBuilder.array([]),
            idiomas: this.formBuilder.array([]),
            outrasInformacoes: this.createOutrasInformacoes(),
            diversidade: this.createDiversidade(),
            pcd: this.formBuilder.array([])
        });
        this.carregarDadosCandidato();

        this.idb.getItem('offline').then((result) => {
            if (result) {
                this.idb.delItem('offline');
                this.mostrarDialogAtualizarDadosCadastro();
            }
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }

    carregarDadosCandidato() {
        this.caracteristicasService.getCadastroDTO()
        .subscribe(cadastro => {
            this.userInternalId = cadastro.userInternalId;
            if (cadastro.experiencias.length !== 0) {
                this.experiencias = <FormArray>this.cadastroExpress.controls['experiencias'];
                cadastro.experiencias.forEach((item) => {
                    this.experiencias.push(this.createExperiencia());
                });
            }

            this.formacoes = <FormArray>this.cadastroExpress.controls['formacoes'];
            cadastro.formacoes.forEach((item) => {
                this.formacoes.push(this.createFormacao());
            });

            this.idiomas = <FormArray>this.cadastroExpress.controls['idiomas'];
            cadastro.idiomas.forEach((item) => {
                this.idiomas.push(this.createIdioma());
            });

            this.competencias = <FormArray>this.cadastroExpress.controls['competencias'];
            cadastro.competencias.forEach((item) => {
                this.competencias.push(new FormControl(''));
            });

            this.beneficios = <FormArray>this.cadastroExpress.controls['beneficios'];
            cadastro.beneficios.forEach((item) => {
                this.beneficios.push(new FormControl(''));
            });

            this.pcd = <FormArray>this.cadastroExpress.controls['pcd'];
            cadastro.pcd.forEach((item) => {
                this.pcd.push(this.createPcd());
            });

            if (this.pcd.length == 0) {
              this.incluirBoxPcd();
            }

            if (cadastro.diversidade.termoAceite) {
              this.habilitarDiversidade();
            }

            this.cadastroExpress.patchValue(cadastro);
            this.checarListaBeneficios();

            this.checarExperiencia();

        }, error => {
        });
    }

    habilitarDesabitarBlocoExperiencia(event: MatSlideToggleChange) {
        this.semExperiencia = event.checked;

        if (this.semExperiencia === true) {
            this.deleteExperiencia(0);
        } else {
            this.addExperiencia();
        }
    }

    habilitarValidacaoDoCampoRemuneracao() {
        this.cadastroExpress.controls.remuneracao.get('remuneracao').setValidators(Validators.required);
        this.cadastroExpress.controls.remuneracao.get('remuneracao').updateValueAndValidity();
    }

    desabilitarValidacaoDoCampoRemuneracao() {
        this.cadastroExpress.controls.remuneracao.get('remuneracao').clearValidators();
        this.cadastroExpress.controls.remuneracao.get('remuneracao').updateValueAndValidity();
    }

    checarExperiencia() {
        if (this.cadastroExpress.get('experiencias').value.length === 0) {
            this.desabilitarValidacaoDoCampoRemuneracao();
            this.desabilitarCampoSemExperiencia = false;
            this.semExperiencia = true;
        } else if (!this.cadastroExpress.get('experiencias').value[0].nomeEmpresa) {
            this.desabilitarValidacaoDoCampoRemuneracao();
            this.desabilitarCampoSemExperiencia = false;
            this.semExperiencia = false;
        } else {
            this.habilitarValidacaoDoCampoRemuneracao();
            this.desabilitarCampoSemExperiencia = true;
            this.semExperiencia = false;
        }
    }

    createExperiencia(): FormGroup {
        return this.formBuilder.group({
            nomeEmpresa: ['', Validators.required],
            cargo: ['', Validators.required],
            areaAtuacaoRowKey: ['', Validators.required],
            areaAtuacaoDescricao: [''],
            inicio: ['', Validators.required],
            final: [''],
            atual: [false],
            rowKey: [''],
        });
    }
    adicionarNovoCargoEmpresa(experiencia, i): void {
        this.experiencias = this.cadastroExpress.get('experiencias') as FormArray;
        this.experiencias.insert(i + 1, this.criarNovoCargo(experiencia.value.nomeEmpresa, experiencia.value.atual));
    }

    criarNovoCargo(nomeEmpresa, atual = false): FormGroup {
        return this.formBuilder.group({
            nomeEmpresa: [nomeEmpresa, Validators.required],
            cargo: ['', Validators.required],
            areaAtuacaoRowKey: ['', Validators.required],
            areaAtuacaoDescricao: [''],
            inicio: ['', Validators.required],
            final: [''],
            // addCargoUmCargo: [''],
            rowKey: [''],
            atual: [atual],
        });
    }


    get getCompetencias() {
        return this.cadastroExpress.get('competencias') as FormArray;
    }

    get getExperiencias() {
        return this.cadastroExpress.get('experiencias') as FormArray;
    }

    addExperiencia() {
        this.experiencias = this.cadastroExpress.get('experiencias') as FormArray;
        this.experiencias.push(this.createExperiencia());
        this.checarExperiencia();
    }

    deleteExperiencia(i) {
        this.experiencias.removeAt(i);
        this.checarExperiencia();
    }

    createFormacao(): FormGroup {
        return this.formBuilder.group({
            instituicao: ['', Validators.required],
            curso: ['', Validators.required],
            nivel: ['', Validators.required],
            inicio: ['', Validators.required],
            final: [''],
            statusCurso: [''],
            rowKeyStatusCurso: ['', Validators.required],
            rowKey: [''],
        });
    }

    get getFormacoes() {
        return this.cadastroExpress.get('formacoes') as FormArray;
    }

    addFormacao() {
        this.formacoes = this.cadastroExpress.get('formacoes') as FormArray;
        this.formacoes.push(this.createFormacao());
    }

    get getIdiomas() {
        return this.cadastroExpress.get('idiomas') as FormArray;
    }

    createIdioma(): FormGroup {
        return this.formBuilder.group({
            idioma : [''],
            nivel: [''],
            idiomaRowKey: [''],
            nivelRowKey: ['']
        });
    }

    carregarNivelIdioma() {
        this.nivelIdioma = [
            {RowKey: 'basico', Descricao: 'Básico'},
            {RowKey: 'intermediario', Descricao: 'Intermediário'},
            {RowKey: 'avancado', Descricao: 'Avançado'},
            {RowKey: 'fluente', Descricao: 'Fluente'},
            {RowKey: 'nativo', Descricao: 'Nativo'}
        ];
    }

    createRemuneracao(): FormGroup {
        return this.formBuilder.group({
            remuneracao: [''],
            modeloContratacaoRowKey: [''],
            modeloContratacaoDescricao: [''],
            comissaoMensal: [''],
            bonusAnual: [''],
        });
    }

    createOutrasInformacoes(): FormGroup {
        return this.formBuilder.group({
            disponibilidadeMudanca: [""],
            disponibilidadeViagem: [""],
            disponibilidadeMudancaRowKey: [""],
            disponibilidadeViagemRowKey: [""]
        });
    }

    createDiversidade(): FormGroup {
        return this.formBuilder.group({
            termoAceite: [false],
            transgenero: [{value: false, disabled: true}],
            etnia: [{value: false, disabled: true}],
            sexualidade: [{value: false, disabled: true}]
        });
    }

    createPcd(): FormGroup {
        return this.formBuilder.group({
            tipo: [{value: '', disabled: true}],
            cid: [{value: '', disabled: true}]
        });
    }

    createPerfil(): FormGroup {
        return this.formBuilder.group({
            RowKey: ["", Validators.required],
            Descricao: [""],
        });
    }

    addIdioma() {
        this.idiomas = this.cadastroExpress.get('idiomas') as FormArray;
        this.idiomas.push(this.createIdioma());
    }
    deleteFormacao(i) {
        this.formacoes.removeAt(i);
    }
    deleteIdioma(x) {
        this.idiomas.removeAt(x);
    }
    get getBeneficios() {
        return this.cadastroExpress.get('beneficios') as FormArray;
    }

    get CadastroExpresso() {
        return this.cadastroExpress.get('cadastro');
    }

    adicionarDescricaoIdiomaNivel() {
        this.cadastroExpress.value.idiomas.forEach(idioma => {
            const idiomaSelecionado = this.listaIdiomas.find(elem => elem.RowKey === idioma.idiomaRowKey);
            const nivelSelecionado = this.nivelIdioma.find(elem => elem.RowKey === idioma.nivelRowKey);
            idioma.nivel = nivelSelecionado.Descricao;
            idioma.idioma = idiomaSelecionado.Descricao;
        });
    }

    adicionarDescricaoCluster() {
        const cluster = this.listaClusters.find(elem => elem.RowKey == this.cadastroExpress.value.perfil.RowKey);
        this.cadastroExpress.value.perfil.Descricao = cluster.Descricao;
    }

    adicionarRowKeyMobilidade() {
      const mudanca = this.listaDisponibilidadeMudanca.find(elem => elem.Descricao == this.cadastroExpress.value.outrasInformacoes.disponibilidadeMudanca);
      const viagem = this.listaDisponibilidadeViagem.find(elem => elem.Descricao == this.cadastroExpress.value.outrasInformacoes.disponibilidadeViagem);

      if (mudanca) {
        this.cadastroExpress.value.outrasInformacoes.disponibilidadeMudancaRowKey = mudanca.RowKey;
      } else {
        delete this.cadastroExpress.value.outrasInformacoes.disponibilidadeMudancaRowKey;
      }

      if (viagem) {
        this.cadastroExpress.value.outrasInformacoes.disponibilidadeViagemRowKey = viagem.RowKey;
      } else {
        delete this.cadastroExpress.value.outrasInformacoes.disponibilidadeViagemRowKey;
      }
    }

    salvarEcontinuar() {
        this.checarExperiencia();

        if (this.cadastroExpress.valid && this.cadastroExpress.get('formacoes').value.length !== 0) {
            this.cadastroExpress.value.beneficios = this.listaBeneficios.filter(function(element) { return element.selected; });
            this.cadastroExpress.value.formacoes.forEach(x => {
                const status = this.listaStatusFormacaoAcademica.find(e => e.RowKey === x.rowKeyStatusCurso);
                x.statusCurso = status.Descricao;
            });

            this.adicionarDescricaoIdiomaNivel();
            this.adicionarRowKeyMobilidade();
            this.adicionarDescricaoCluster();

            if (window.navigator.onLine) {
                this.caracteristicasService.putCadastro(this.cadastroExpress.value)
                .subscribe(cadastro => {
                    // tslint:disable-next-line:triple-equals
                    if (this.parametros != undefined && !(this.parametros.vagaId == null)) {
                        this.parametros.codigoIndicacaoDoFuncionario = this.cadastroExpress.controls.codigoIndicacaoFuncionario.value;
                        localStorage.setItem('ls.parametros', JSON.stringify(this.parametros));
                        localStorage.setItem("ls.vagaId", this.parametros.vagaId);
                        /* this.vagaService.realizarCandidaturaVagaComParametros(this.parametros)
                        .subscribe(vaga => {
                            this.vagaService.rodarEngineParaAnalisarPerfil(this.parametros.vagaId, this.userInternalId)
                            .subscribe(value => {
                                localStorage.setItem('ls.parametros', JSON.stringify(this.parametros));
                                localStorage.setItem("ls.vagaId", this.parametros.vagaId);
                                alert('Dados salvos com sucesso!');
                                this.router.navigate([ '/inventario-comportamental' ]);
                            });
                        },
                        error =>  {
                            this.mensagemErroAoValidarCodigoFuncionario = error.error;
                        }); */
                        alert('Próxima Etapa!');
                      this.router.navigate([ '/inventario-comportamental' ]);
                    } else {
                      alert('Próxima Etapa!');
                      this.router.navigate([ '/inventario-comportamental' ]);
                    }
                });
            } else {
                this.idb.setItem('candidato', this.cadastroExpress.value).then((result) => {
                    this.idb.setItem('offline', true);

                    let desc = 'Desculpe, mas não foi possível atualizar seus dados no momento. ';
                    if (result) {
                        desc += 'Suas alterações serão salvas neste dispositivo e enviados quando estiver online.';
                        this.mostrarDialogOffline(desc);
                    } else {
                        desc += 'Ocorreu um erro ao registrar suas informações neste dispositivo.';
                        this.mostrarDialogOffline(desc);
                        console.log(result);
                    }
                });
            }
        }
    }

  salvar() {
    this.checarExperiencia();

    if (this.cadastroExpress.valid && this.cadastroExpress.get('formacoes').value.length !== 0) {
      this.cadastroExpress.value.beneficios = this.listaBeneficios.filter(function(element) { return element.selected; });
      this.cadastroExpress.value.formacoes.forEach(x => {
        const status = this.listaStatusFormacaoAcademica.find(e => e.RowKey === x.rowKeyStatusCurso);
        x.statusCurso = status.Descricao;
      });

      this.adicionarDescricaoIdiomaNivel();
      this.adicionarRowKeyMobilidade();

      if (window.navigator.onLine) {
        this.caracteristicasService.putCadastro(this.cadastroExpress.value)
          .subscribe(cadastro => {
            // tslint:disable-next-line:triple-equals

            if (this.parametros != undefined && this.parametros.vagaId) {
              this.parametros.codigoIndicacaoDoFuncionario = this.cadastroExpress.controls.codigoIndicacaoFuncionario.value;
              localStorage.setItem('ls.parametros', JSON.stringify(this.parametros));


              /* this.vagaService.realizarCandidaturaVagaComParametros(this.parametros)
                .subscribe(vaga => {
                  this.vagaService.rodarEngineParaAnalisarPerfil(this.parametros.vagaId, this.userInternalId)
                    .subscribe(value => {
                      localStorage.setItem('ls.vagaId', this.parametros.vagaId);
                      alert('Dados salvos com sucesso!');
                      // window.location.href = '/candidato/#/dashboard';
                    });
                }, error =>  {
                  this.mensagemErroAoValidarCodigoFuncionario = error.error;
                });
              alert('Dados salvos com sucesso!'); */
              }


          });
      } else {
          this.idb.setItem('candidato', this.cadastroExpress.value).then((result) => {
              this.idb.setItem('offline', true);

              let desc = 'Desculpe, mas não foi possível atualizar seus dados no momento. ';
              if (result) {
                  desc += 'Suas alterações serão salvas neste dispositivo e enviados quando estiver online.';
                  this.mostrarDialogOffline(desc);
              } else {
                  desc += 'Ocorreu um erro ao registrar suas informações neste dispositivo.';
                  this.mostrarDialogOffline(desc);
                  console.log(result);
              }
          });
      }

    }
  }

    checarListaBeneficios() {
        // se o array da lista de beneficios não for carregada
        if (this.listaBeneficios === undefined) {
            // carrega os beneficios
            this.caracteristicasService.getBeneficios()
            .subscribe(beneficios => {
                this.listaBeneficios = beneficios;
                // assinala os beneficios selecionados pelo candidato
                this.listaBeneficios.forEach(x => {
                    const value = this.cadastroExpress.value.beneficios.find( function (element) {
                        return element.rowKey === x.RowKey;
                    });
                    x.selected = value !== undefined;
                });
            });
        } else {
            this.listaBeneficios.forEach(x => {
                const value = this.cadastroExpress.value.beneficios.find( function (element) {
                    return element.rowKey === x.RowKey;
                });
                x.selected = value !== undefined;
            });
        }

    }

    toggleBeneficios($event: MatCheckboxChange, beneficio) {
        const index = this.listaBeneficios.indexOf(beneficio);
        beneficio.selected = $event.checked;
        this.listaBeneficios.splice(index, 0, beneficio);
        this.listaBeneficios.splice(index, 1);
    }

    // exibe o dialog para confirmar a remoção do item
    openDialog(posicao, tipo = '') {
        // console.log(posicao, tipo);
        switch (tipo) {
            case 'experiencia':
            var desc = 'Deseja remover esta experiência profissional do seu currículo?';
            break;
            case 'formacao':
            var desc = 'Deseja remover esta formação acadêmica do seu currículo?';
            break;
            case 'idioma':
            var desc = 'Deseja remover este idioma do seu currículo?';
            break;
            default:
            var desc = '';
            break;
        }

        const mostarDialogRemoverItem = this.dialog.open(DialogComponent, {
            data: {
                titulo:    'Remover item',
                descricao: desc,
                botoes:    [{color: 'warn', texto: 'Sim', funcao: 'confirmacao'}, {color: 'accent', texto: 'Não', funcao: 'fechar'}]
            }
        }).afterClosed().subscribe(confirma => {
            if (confirma) {
                switch (tipo) {
                    case 'experiencia':
                    this.deleteExperiencia(posicao);
                    break;

                    case 'formacao':
                    this.deleteFormacao(posicao);
                    break;

                    case 'idioma':
                    this.deleteIdioma(posicao);
                    break;

                    default:
                    console.log('Opção ' + tipo + ' inválido!');
                    break;
                }
            }
        });
    }

    mostrarDialogOffline(descritivo) {
        this.dialog.open(DialogComponent, {
            data: {
                titulo:    'Dispositivo Offline!',
                descricao: descritivo,
                botoes:    [{color: 'accent', texto: 'Ok', funcao: 'fechar'}]
            }
        });
    }

    mostrarDialogAtualizarDadosCadastro() {
        this.dialog.open(DialogComponent, {
            data: {
                titulo:    'Dados encontrados!',
                descricao: 'Deseja enviar os dados armazenados do seu dispositivo?',
                botoes:    [{color: 'warn', texto: 'Não', funcao: 'fechar'}, {color: 'accent', texto: 'Sim', funcao: 'confirmacao'}]
            }
        }).afterClosed().subscribe(confirma => {
            if (confirma) {
                this.idb.getItem('candidato').then(candidato => {
                    this.caracteristicasService.putCadastro(candidato)
                    .subscribe(cadastro => {
                        this.idb.delItem('candidato');
                        window.location.reload();
                    });
                });
            }
        });
    }

    mostrarDialogTermosUso() {
        this.dialog.open(DialogComponent, {
            data: {
                titulo:    'Termo de Uso - Reachr Diversidade',
                descricao: "termos-uso",
                botoes:    [{color: 'warn', texto: 'Continuar', funcao: 'fechar'}, {color: 'accent', texto: 'Li e aceito os Termos de uso', funcao: 'confirmacao'}]
            }
        }).afterClosed().subscribe(confirma => {
            if (confirma) {
                this.cadastroExpress.get('diversidade.termoAceite').setValue(true);
                this.habilitarDiversidade();
            } else {
                this.desabilitarLimparDiversidade();
            }
        });
    }

    changeTermo($event) {
        if($event.checked == true) {
            this.habilitarDiversidade();
        } else {
            this.desabilitarLimparDiversidade();
        }
    }

    habilitarDiversidade() {
        this.cadastroExpress.get('pcd').enable();
        this.cadastroExpress.get('genero').enable();
        this.cadastroExpress.get('diversidade.sexualidade').enable();
        this.cadastroExpress.get('diversidade.etnia').enable();
        this.cadastroExpress.get('diversidade.transgenero').enable();
        this.formDiversidade.termoUsoAceito = true;
    }

    desabilitarLimparDiversidade() {
        this.cadastroExpress.get('pcd').disable();
        this.cadastroExpress.get('genero').disable();
        this.cadastroExpress.get('diversidade.sexualidade').disable();
        this.cadastroExpress.get('diversidade.etnia').disable();
        this.cadastroExpress.get('diversidade.transgenero').disable();
        this.formDiversidade.termoUsoAceito = false;

        this.cadastroExpress.controls['genero'].setValue('');
        this.cadastroExpress.get('diversidade.sexualidade').setValue(null);
        this.cadastroExpress.get('diversidade.etnia').setValue(null);
        this.cadastroExpress.get('diversidade.transgenero').setValue(null);
        for (var i = this.pcd.length - 1; i >= 0; i--) {
            this.removerBoxPcd(i);
        }
        this.incluirBoxPcd();
    }

    getParametrosBackEnd(params): IParametrosBackEnd {
        return {
            vagaId: params['vagaId'],
            redirect: params['redirect'],
            origem: params['origem'],
            midiaCampanha: params['midiaCampanha'],
            nomeCampanha: params['nomeCampanha'],
            codigoIndicacaoDoFuncionario: ""
        };
    }

    private carregarVaga() {
        this.vagaService.getVaga(this.parametros.vagaId)
        .subscribe(vaga => {
            this.vaga = vaga;
            console.log('saida',this.vaga);
        });
    }

    /**
     * Box PCD
     */
    incluirBoxPcd() {
        this.pcd = this.cadastroExpress.get('pcd') as FormArray;
        this.pcd.push(this.createPcd());
        this.cadastroExpress.get('pcd').enable();
    }

    removerBoxPcd(index) {
        this.pcd.removeAt(index);
    }

    get getPcd() {
        return this.cadastroExpress.get('pcd') as FormArray;
    }
}
