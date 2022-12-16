import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiServe } from "../../Globales/ApiServe";

@Injectable({
  providedIn: "root",
})
export class RolService {
  constructor(public httpclient: HttpClient) {}

  guardar(rol: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "rol/", rol);
  }
  editar(id, rol: any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER + "rol/" + id, rol);
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "rol/");
  }
  listarActivos(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "rol/activos");
  }

  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "rol/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "rol/" + id);
  }
  anular(id: number, motivo: string): Observable<any> {
    return this.httpclient.put(
      ApiServe.API_SERVER + "rol/anular/" + id,
      motivo
    );
  }
}
