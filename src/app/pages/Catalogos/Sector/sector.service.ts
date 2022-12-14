import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ApiServe } from '../../../ApiServe';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  constructor(public httpclient: HttpClient) { }

  guardar(sector: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "sector/", sector);
  }
  editar(id, sector: any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER + "sector/" + id, sector);
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "sector/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "sector/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "sector/" + id);
  }
}
