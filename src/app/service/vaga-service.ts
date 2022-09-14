import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class VagaService {

  constructor(public http: HttpClient) {
  }

  getVaga(vagaId: string) {
    return this.http
      .get<Object[]>('api/VagaParts/Vaga/' + vagaId + '?v=' + new Date().getTime());
  }

  realizarCandidaturaVagaComParametros(parametros: IParametrosBackEnd) {
    this.registrarCandidatoEmpresa(parametros.vagaId).subscribe(value => {});
    return this.http.post('api/VagaCandidatoParts/CandidatarVaga', JSON.stringify(parametros))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err);
        })
      );
  }

  registrarCandidatoEmpresa(vagaId) {
    return this.http.post('api/CurriculoParts/CandidatoEmpresa/' + vagaId + '?v=' + new Date().getTime(), {})
      .pipe();
  }

  rodarEngineParaAnalisarPerfil(vagaId, userInternalId) {
    const statusSend = {
      CandidatoId: userInternalId,
      VagaId: vagaId,
      EtapaId: 'fed5da4e-a83c-469d-a456-5aa1de06a883',
      EtapaNome: 'Like',
      Status: 9,
      Origem: 2,
      Segundos: 0,
      Decisao: 0
    };

    return this.http.put('api/VagaStatus', statusSend)
      .pipe();
  }
}
