import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { tap } from "rxjs/operators";
import { ApiServe } from "../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class CategoriaService {
  constructor(public httpclient: HttpClient) {}

  guardar(categoria: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "categoria/", categoria);
  }
  editar(id, categoria: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "categoria/" + id,
      categoria
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "categoria/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "categoria/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "categoria/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "categoria/" + id);
  }
  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "categoria/anular/" + id,
      motivo
    );
  }
}
