import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class detalleEventoPersonaPersonaService {
  constructor(public httpclient: HttpClient) {}

  guardar(dep: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "detalleEventoPersona/",
      dep
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEventoPersona/");
  }

  horasPorPersonaDetalleEvento(personaId: number, fecha: any): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER +
        "detalleEventoPersona/horasPorPersonaDetalleEvento/" +
        personaId +
        "/" +
        fecha
    );
    // http://localhost:8080/detalleEventoPersona/horasPorPersonaDetalleEvento/?personaId=8?fecha=2022-12-17
    // return this.httpclient.get(
    //   ApiServe.API_SERVER +
    //     "detalleEventoPersona/horasPorPersonaDetalleEvento/?personaId=" +
    //     personaId +
    //     "&?fecha=" +
    //     fecha
    // );
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "detalleEventoPersona/" + id
    );
  }

  listarPorDetalleEvento(id): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "detalleEventoPersona/detalleEvento/" + id
    );
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(
      ApiServe.API_SERVER + "detalleEventoPersona/" + id
    );
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "detalleEventoPersona/anular/" + id,
      motivo
    );
  }
}
