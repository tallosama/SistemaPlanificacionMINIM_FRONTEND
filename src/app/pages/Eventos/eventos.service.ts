import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class EventosService {
  constructor(public httpclient: HttpClient) {}

  guardar(evento: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "evento/", evento);
  }
  editar(id, evento: any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER + "evento/" + id, evento);
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "evento/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "evento/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "evento/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "evento/" + id);
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "evento/anular/" + id,
      motivo
    );
  }

  listarPorPlan(planId): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "evento/plan/" + planId);
  }
}
