import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiServe } from "../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class CargoService {
  constructor(public httpclient: HttpClient) {}

  guardar(cargo: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "cargo/", cargo);
  }
  editar(id, cargo: any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER + "cargo/" + id, cargo);
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "cargo/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "cargo/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "cargo/" + id);
  }
}
