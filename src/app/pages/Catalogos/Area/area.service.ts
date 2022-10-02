import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiServe } from '../../../ApiServe';
@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(public httpclient: HttpClient) { }

// refresh$=new Subject();
// get refresh(){
//   return this.refresh$.next();
// }
//   //En tiempo real
//   guardar(area:any): Observable<any> {
//     return this.httpclient.post(ApiServe.API_SERVER+"area/",area).pipe(tap(()=>{
//       this.refresh$.next();
//     }));
//   }

  guardar(area: any): Observable<any> {
    return this.httpclient.post(ApiServe.API_SERVER + "area/", area);
  }

  editar(id, area: any): Observable<any> {
    return this.httpclient.put(ApiServe.API_SERVER + "area/" + id, area);
  }
  listar(): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "area/");
  }
  buscar(id): Observable<any> {
    return this.httpclient.get(ApiServe.API_SERVER + "area/" + id);
  }
  eliminar(id): Observable<any> {
    return this.httpclient.delete(ApiServe.API_SERVER + "area/" + id);
  }

}
