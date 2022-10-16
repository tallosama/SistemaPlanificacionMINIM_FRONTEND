import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServe } from '../../../ApiServe';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(public httpclient:HttpClient) { }

  guardar(persona:any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER+"persona/",persona);
  }
  editar(id,persona:any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER+"persona/"+id,persona);
  }
  listar():Observable<any>  {
    return this.httpclient.get(ApiServe.API_SERVER+"persona/");
  }
  listarPorArea(areaId):Observable<any>  {
    return this.httpclient.get(ApiServe.API_SERVER+"persona/area/"+areaId);
  }
  buscar(id):Observable<any>  {
    return this.httpclient.get(ApiServe.API_SERVER+"persona/"+id);
  }
  eliminar(id):Observable<any>  {
    return this.httpclient.delete(ApiServe.API_SERVER+"persona/"+id);
  }
}
