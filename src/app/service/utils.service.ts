import { Injectable } from '@angular/core';
import { Select } from '../model/Select';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

constructor() { }
  getTipoPcd(): Select[] {
    const lista: Select[] = [];
    lista.push({RowKey: 'fisica', Descricao: 'Física', valor: 'fisica'});
    lista.push({RowKey: 'visual', Descricao: 'Visual', valor: 'visual'});
    lista.push({RowKey: 'auditivo', Descricao: 'Auditivo', valor: 'auditivo'});
    lista.push({RowKey: 'intelectual', Descricao: 'Intelectual', valor: 'intelectual'});
    lista.push({RowKey: 'psicosocial', Descricao: 'Psicosocial', valor: 'psicosocial'});
    return lista;
  }

  getGenero(): Select[] {
    const lista: Select[] = [];
    lista.push({RowKey: 'masculino', Descricao: 'Masculino', valor: 'Masculino'});
    lista.push({RowKey: 'feminino', Descricao: 'Feminino', valor: 'Feminino'});
    return lista;
  }
}
