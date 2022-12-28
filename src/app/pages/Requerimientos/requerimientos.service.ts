import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class RequerimientosService {
  constructor(public httpclient: HttpClient) {}

  guardar(Requerimiento: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "Requerimiento/",
      Requerimiento
    );
  }
  editar(id, Requerimiento: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "Requerimiento/" + id,
      Requerimiento
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "Requerimiento/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "Requerimiento/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "Requerimiento/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "Requerimiento/" + id);
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "Requerimiento/anular/" + id,
      motivo
    );
  }

  // listarPorPlan(planId): Observable<any> {
  //   return this.httpclient.get(ApiServe.API_SERVER + "Requerimiento/plan/" + planId);
  // }
}
