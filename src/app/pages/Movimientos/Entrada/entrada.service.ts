import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { ApiServe } from "../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class EntradaService {
  constructor(public httpclient: HttpClient) {}

  guardar(entradaMaterial: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "entradaMaterial/",
      entradaMaterial
    );
  }
  editar(id, entradaMaterial: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "entradaMaterial/" + id,
      entradaMaterial
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "entradaMaterial/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "entradaMaterial/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "entradaMaterial/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(
      ApiServe.API_SERVER + "entradaMaterial/" + id
    );
  }
  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "entradaMaterial/anular/" + id,
      motivo
    );
  }
  listarPorFechas(fechaInicio: string, fechaFinal: string): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER +
        "entradaMaterial/porFechas/" +
        fechaInicio +
        "/" +
        fechaFinal
    );
  }
  listarPorFechasActivos(
    fechaInicio: string,
    fechaFinal: string
  ): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER +
        "entradaMaterial/porFechasActivos/" +
        fechaInicio +
        "/" +
        fechaFinal
    );
  }
}
