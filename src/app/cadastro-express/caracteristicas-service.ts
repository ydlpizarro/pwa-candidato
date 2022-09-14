import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class CaracteristicasService {

  constructor(public http: HttpClient) {}

  private _refreshNeeded$  = new Subject<void>();

  public refreshNeesded$ = this._refreshNeeded$.asObservable();
  getBeneficios() {

    return this.http
      .get<Object[]>('api/caracteristicas/searchconnectmodelcaracteristicatiposbasicosbeneficio');
  }

  getCadastroDTO() {
    // se o usuário estiver online, salva o timestamp localmente
    if (window.navigator.onLine) {
      var timestamp: string = new Date().getTime().toString();
      localStorage.setItem('timestamp', timestamp);
    }
    // se o usuário estiver offline, carrega o último timestamp registrado
    else {
      var timestamp: string = localStorage.getItem('timestamp');
    }

    return this.http
      .get<any>('api/CurriculoParts/CadastroExpress?timestemp=' + timestamp);
  }


  putCadastro(data) {
    return this.http.post('api/CurriculoParts/CadastroExpresso', data)
      .pipe(catchError(data));
  }

  getAreaDeAtuacao() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicosareaatuacao');
  }

  getIdiomas() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicosidioma');
  }

  getTipoContratacao() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicostipocontratacao');
  }

  getStatusFormacaoAcademica() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicosstatussuperior');
  }

  getClusters() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicoscluster');
  }

  enviarRespostaDom(data) {
    return this.http.post('api/Avaliacao/Respostas', data);
  }

  carregarLaudoDom() {
    return this.http.get('api/Avaliacao/Laudo');
  }

  postProvas(tipo) {
    return this.http.post('api/provas', tipo);
  }

  postCandidatoProva(candidatoId, prova) {
    return this.http.post('api/candidatos/' + candidatoId + '/provas', prova)
    .pipe(
      tap(()=>{
        this._refreshNeeded$.next();
      })
    );
  }

  getCandidatoProvas(candidatoId, tipo) {
    return this.http.get('api/candidatos/' + candidatoId + '/Provas?tipo=' + tipo);
  }

  getDisponibilidadeViagem() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicosviagemdisponibilidade');
  }

  getDisponibilidadeMudanca() {
    return this.http
      .get<Object[]>('api/caracteristicas/approved/searchconnectmodelcaracteristicatiposbasicosmudancadisponibilidade');
  }
}
