import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../../../ApiServe";

@Injectable({
  providedIn: "root",
})
export class MunicipioService {
  constructor(public httpclient: HttpClient) {}

  guardar(municipio: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "municipio/", municipio);
  }
  editar(id, municipio: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "municipio/" + id,
      municipio
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "municipio/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "municipio/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "municipio/" + id);
  }
}
