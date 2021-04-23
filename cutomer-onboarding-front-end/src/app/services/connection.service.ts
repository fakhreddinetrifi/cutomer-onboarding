import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  baseUrl = 'http://192.168.60.34:8085';
  constructor(private http: HttpClient) { }

  sendEamil(messageContent: any) {
    return this.http.post(`${this.baseUrl}/sendemail`, messageContent, {responseType: 'text'});
  }

  sendEamilUpdated(messageContent: any) {
    return this.http.post(`${this.baseUrl}/sendemailupdate`, messageContent, {responseType: 'text'});
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

  authorization() {
    this.http.post(
      '/rest/authenticate',
      {
        login: 'bhurch',
        password: 'maarch',
      },
      {
        observe: 'response'
      }
    ).subscribe(data => {
      localStorage.setItem('key', data.headers.get('Token'));
    });
  }



  getRessource(id: number, key: string) {
    return this.http.get(
      `/rest/resources/${id}`,
      {headers: {Authorization: `Bearer ${key}`}}
    );
  }

  updateRessource(id: number, key: string, ressouce: any) {
    return this.http.put(
      `/rest/resources/${id}`,
      ressouce,
      {headers: {Authorization: `Bearer ${key}`}}
    );
  }
  deleteAttachment(id: number, key: string) {
    return this.http.delete(
      `/rest/attachments/${id}`,
      {headers: {Authorization: `Bearer ${key}`}}
    );
  }

  addAttachment(key: string, attachment: any) {
    return this.http.post(
      `/rest/attachments`,
      attachment,
      {headers: {Authorization: `Bearer ${key}`}}
    );
  }

  // uploadTrigger(fileInput: any) {
  //   if (fileInput.target.files && fileInput.target.files[0] && this.isExtensionAllowed(fileInput.target.files[0])) {
  //     this.initUpload();
  //
  //     const reader = new FileReader();
  //     this.file.name = fileInput.target.files[0].name;
  //     this.file.type = fileInput.target.files[0].type;
  //     this.file.format = this.file.name.split('.').pop();
  //
  //     reader.readAsArrayBuffer(fileInput.target.files[0]);
  //
  //     reader.onload = (value: any) => {
  //       this.file.content = this.getBase64Document(value.target.result);
  //       this.triggerEvent.emit();
  //       if (this.file.type !== 'application/pdf') {
  //         this.convertDocument(this.file);
  //       } else {
  //         this.file.src = value.target.result;
  //         this.loading = false;
  //       }
  //     };
  //   } else {
  //     this.loading = false;
  //   }
  // }
  //
  // isExtensionAllowed(file: any) {
  //   const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
  //   if (this.allowedExtensions.filter(ext => ext.mimeType === file.type && ext.extension === fileExtension).length === 0) {
  //     this.dialog.open(AlertComponent, { panelClass: 'maarch-modal', autoFocus: false, disableClose: true, data: { title: this.translate.instant('lang.notAllowedExtension') + ' !', msg: this.translate.instant('lang.file') + ' : <b>' + file.name + '</b>, ' + this.translate.instant('lang.type') + ' : <b>' + file.type + '</b><br/><br/><u>' + this.translate.instant('lang.allowedExtensions') + '</u> : <br/>' + this.allowedExtensions.map(ext => ext.extension).filter((elem: any, index: any, self: any) => index === self.indexOf(elem)).join(', ') } });
  //     return false;
  //   } else if (file.size > this.maxFileSize && this.maxFileSize > 0) {
  //     this.dialog.open(AlertComponent, { panelClass: 'maarch-modal', autoFocus: false, disableClose: true, data: { title: this.translate.instant('lang.maxFileSizeReached') + ' ! ', msg: this.translate.instant('lang.maxFileSize') + ' : ' + this.maxFileSizeLabel } });
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

}
