import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { ApiServe } from "../../Globales/ApiServe";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductoService {
  constructor(public httpclient: HttpClient) {}

  guardar(producto: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "producto/", producto);
  }
  editar(id, producto: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "producto/" + id,
      producto
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "producto/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "producto/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "producto/" + id);
  }
}
