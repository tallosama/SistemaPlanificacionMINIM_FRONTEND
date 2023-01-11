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
  agregarStock(id: number, cantStock: number): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "producto/sumarCantidadStock/" + id,
      cantStock
    );
  }
  restarStock(id: number, cantStock: number): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "producto/restarCantidadStock/" + id,
      cantStock
    );
  }
  //actualizarCantidadStock
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "producto/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "producto/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "producto/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "producto/" + id);
  }
  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "producto/anular/" + id,
      motivo
    );
  }
}
