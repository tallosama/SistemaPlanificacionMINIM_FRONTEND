import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { ApiServe } from "../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class SeguimientoEventoService {
  constructor(public httpclient: HttpClient) {}

  guardar(evento: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "seguimientoEvento/",
      evento
    );
  }
  editar(id, evento: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "seguimientoEvento/" + id,
      evento
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "seguimientoEvento/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "seguimientoEvento/activos"
    );
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "seguimientoEvento/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(
      ApiServe.API_SERVER + "seguimientoEvento/" + id
    );
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "seguimientoEvento/anular/" + id,
      motivo
    );
  }

  listarPorEvento(eventoId): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "seguimientoEvento/evento/" + eventoId
    );
  }
}
