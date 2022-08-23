import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServe } from '../../ApiServe';
@Injectable({
  providedIn: 'root'
})
export class AreaService { 
  constructor(public httpclient:HttpClient) { }
  
  guardar(area:any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER+"area/",area);
  }
  editar(id,area:any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER+"area/"+id,area);
  }
  listar():Observable<any>  {
    return this.httpclient.get(ApiServe.API_SERVER+"area/");
  } 
  buscar(id):Observable<any>  {
    return this.httpclient.get(ApiServe.API_SERVER+"area/"+id);
  } 
  eliminar(id):Observable<any>  {
    return this.httpclient.delete(ApiServe.API_SERVER+"area/"+id);
  } 
  
}
