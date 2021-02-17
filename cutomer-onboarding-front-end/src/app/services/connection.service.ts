import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  baseUrl = 'http://localhost:8081';
  constructor(private http: HttpClient) { }

  sendEamil(messageContent: any) {
    return this.http.post(`${this.baseUrl}/sendemail`, messageContent, {responseType: 'text'});
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  getInit(): Observable<any>  {
    return this.http.get(`${this.baseUrl}/init`, {responseType: 'text'});
  }

  // tslint:disable-next-line:typedef
  recieveMail(messageContent: any) {
    return this.http.post(`${this.baseUrl}/recieved`, messageContent);
  }
}
