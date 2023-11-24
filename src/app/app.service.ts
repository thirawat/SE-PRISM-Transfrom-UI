
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = 'https://api.prism-transform.demosolution.app/api';

  constructor(private http: HttpClient) { }

  getNewUUID(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/new`);
  }

  getByUUID(uuid:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${uuid}`);
  }

  transform(uuid:string,xml:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${uuid}`,{uuid:uuid,xml:xml});
  }

  save(uuid:string,xml:string,prism:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save/${uuid}`,{uuid:uuid,xml:xml,prism:prism});
  }
}
