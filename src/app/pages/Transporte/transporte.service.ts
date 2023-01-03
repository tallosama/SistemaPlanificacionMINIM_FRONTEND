import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class TransporteService {
  constructor(public httpclient: HttpClient) {}
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "transporte/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "transporte/activos");
  }
  listarPorRequerimiento(idRequerimiento: number): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "transporte/requerimiento/" + idRequerimiento
    );
  }
  listarPorFechas(fechaInicio: string, fechaFinal: string): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER +
        "transporte/porFechas/" +
        fechaInicio +
        "/" +
        fechaFinal
    );
  }
  guardar(transporte: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "transporte/",
      transporte
    );
  }
  editar(id, transporte: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "transporte/" + id,
      transporte
    );
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "transporte/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "transporte/" + id);
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "transporte/anular/" + id,
      motivo
    );
  }
}
