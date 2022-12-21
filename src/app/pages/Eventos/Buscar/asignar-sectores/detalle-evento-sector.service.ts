import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { ApiServe } from "../../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class DetalleEventoSectorService {
  constructor(public httpclient: HttpClient) {}

  guardar(dep: any): Observable<any> {
    return this.httpclient.post(
      ApiServe.API_SERVER + "detalleEventoSector/",
      dep
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "detalleEventoSector/");
  }
  sectoresPorDetalleEventoId(id: number): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "detalleEventoSector/detalleEvento/" + id
    );
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(
      ApiServe.API_SERVER + "detalleEventoSector/" + id
    );
  }

  eliminar(id): Observable<any> {
    return this.httpclient.delete(
      ApiServe.API_SERVER + "detalleEventoSector/" + id
    );
  }

  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "detalleEventoSector/anular/" + id,
      motivo
    );
  }
}
