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
  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "detalleEvento/estado/" + id,
      estado
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEvento/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEvento/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEvento/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "detalleEvento/" + id);
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "detalleEvento/anular/" + id,
      motivo
    );
  }

  listarPorEvento(eventoId): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "detalleEvento/evento/" + eventoId
    );
  }
}
