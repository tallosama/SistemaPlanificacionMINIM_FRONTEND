import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiServe } from "../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class VehiculoService {
  constructor(public httpclient: HttpClient) {}

  guardar(vehiculo: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "vehiculo/", vehiculo);
  }
  editar(id, vehiculo: any): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "vehiculo/" + id,
      vehiculo
    );
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "vehiculo/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "vehiculo/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "vehiculo/" + id);
  }
}
