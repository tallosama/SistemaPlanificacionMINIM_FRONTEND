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
      ApiServe.API_SERVER + "requerimiento/",
      Requerimiento
    );
  }
  editar(id, Requerimiento: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "requerimiento/" + id,
      Requerimiento
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "requerimiento/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "requerimiento/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "requerimiento/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "requerimiento/" + id);
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "requerimiento/anular/" + id,
      motivo
    );
  }

  listarPorDetalle(detalleId: number): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "requerimiento/detalleEvento/" + detalleId
    );
  }
  listarPorTipoYEstado(tipo: string, estado: string): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "requerimiento/tipoYEstado/" + tipo + "/" + estado
    );
  }
  requerimientoPorTipoActivoYEStados(
    idDetalle: number,
    estados: Array<string>
  ): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER +
        "requerimiento/detalleYEstados/" +
        idDetalle +
        "/" +
        estados
    );
  }
  //
}
