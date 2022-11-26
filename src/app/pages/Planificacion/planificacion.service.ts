import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class PlanificacionService {
  constructor(public httpclient: HttpClient) {}

  guardar(planificacion: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "planificacion/",
      planificacion
    );
  }
  editar(id, planificacion: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "planificacion/" + id,
      planificacion
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "planificacion/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "planificacion/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "planificacion/" + id);
  }
}
