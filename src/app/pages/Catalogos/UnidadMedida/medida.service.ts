import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiServe } from '../../../ApiServe';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedidaService {

  constructor(public httpclient: HttpClient) { }

  guardar(unidadMedida: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "unidadMedida/", unidadMedida);
  }
  editar(id, unidadMedida: any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER + "unidadMedida/" + id, unidadMedida);
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "unidadMedida/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "unidadMedida/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "unidadMedida/" + id);
  }

}
