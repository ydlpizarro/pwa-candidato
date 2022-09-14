import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Store, set, get, del, keys, clear } from 'idb-keyval';

@Injectable({
  providedIn: 'root'
})
export class IdbKeyvalService {

  private dbname;

  constructor() {
    this.dbname = new Store(environment.pwaIndexedDBName, environment.pwaIndexedStoreName);
  }

  setItem(registro: string, dados) {
    return new Promise((resolve, reject) => {
      set(registro, dados, this.dbname).then(() => {
        resolve(true);
      }).catch(error => {
        console.log('Ocorreu um erro ao registrar o candidato: ', error);
        reject(false);
      });
    });
  }

  getItem(registro: string) {
    return new Promise((resolve, reject) => {
      get(registro, this.dbname).then(dados => {
        resolve(dados);
      }).catch(error => {
        console.log('Ocorreu um erro ao carregar o candidato: ', error);
        reject(false);
      });
    });
  }

  delItem(registro: string) {
    return new Promise((resolve, reject) => {
      del(registro, this.dbname).then(() => {
        resolve(true);
      }).catch(error => {
        console.log('Ocorreu um erro ao remover o candidato: ', error);
        reject(false);
      });
    });
  }

  returnKeys() {
    return new Promise((resolve, reject) => {
      keys(this.dbname).then((chaves) => {
        resolve(chaves);
      }).catch(error => {
        console.log('Ocorreu um erro ao carregar as chaves: ', error);
        reject(false);
      });
    });
  }

  limpar() {
    return new Promise((resolve, reject) => {
      clear(this.dbname).then(() => {
        resolve(true);
      }).catch(error => {
        console.log('Ocorreu um erro ao limpar a database: ', error);
        reject(false);
      });
    });
  }
}
