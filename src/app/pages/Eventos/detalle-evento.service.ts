import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../Globales/ApiServe";
@Injectable({
  providedIn: "root",
})
export class DetalleEventoService {
  constructor(public httpclient: HttpClient) {}

  guardar(evento: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "detalleEvento/", evento);
  }
  editar(id, evento: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "detalleEvento/" + id,
      evento
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEvento/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEvento/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "detalleEvento/" + id);
  }

  listarPorEvento(eventoId): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "detalleEvento/evento/" + eventoId
    );
  }
}
