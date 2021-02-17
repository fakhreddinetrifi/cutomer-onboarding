
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ConnectionService} from './services/connection.service';
import {Info} from './models/info';
import {Observable} from 'rxjs';
import {HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{

  contactForm: FormGroup;
  disabledSubmitButton = true;
  file: string;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  send = false;
  sended = false;
  email :string;
  @HostListener('input') oninput() {

    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(private fb: FormBuilder, private connectionService: ConnectionService) {
    this.connectionService.getInit().subscribe()
    this.contactForm = fb.group({
      salutation: ['', Validators.required],
      gender: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      dateBirth: ['', Validators.required],
      placeBirth: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.required],
      workphone: ['', Validators.required],
      address: ['', Validators.required],
      typeAccount: ['', Validators.required],
      employer: ['', Validators.required],
      addresswork: ['', Validators.required],
      idNumber: ['', Validators.required],
      total: ['', Validators.required],
      nationality: ['', Validators.required],
      marital: ['', Validators.required],
      attachment: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.connectionService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.connectionService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }
  // tslint:disable-next-line:typedef
  onSubmit() {
    this.send = true;
    const INFO: Info = this.contactForm.value;
    const body = {
      from: INFO.email,
      content: '<table>\n' +
        '  <tr>\n' +
        '    <th>Salutation: </th><td>' + INFO.salutation + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>First name: </th><td>' + INFO.firstname + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Last name: </th><td>' + INFO.lastname + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Gender: </th><td>' + INFO.gender + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Date Birth: </th><td>' + INFO.dateBirth + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Place Birth: </th><td>' + INFO.placeBirth + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Marital Status: </th><td>' + INFO.marital + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Personal phone: </th><td>' + INFO.phone + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Work phone: </th><td>' + INFO.workphone + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Address: </th><td>' + INFO.address + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Account type: </th><td>' + INFO.typeAccount + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Employer: </th><td>' + INFO.employer + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Address work: </th><td>' + INFO.addresswork + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Nationality: </th><td>' + INFO.nationality + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>ID Number: </th><td>' + INFO.idNumber + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Total net worth (EUR): </th><td>' + INFO.total + '</td>' +
        '  </tr>\n' +
        '</table>'
    };
    this.connectionService.sendEamil(body).subscribe(
      () => {
        window.scrollTo(0, 0);
        this.send = false
        this.contactForm.reset();
        this.fileInfos = null
        this.progress = 0;
        this.message = '';
        this.currentFile = undefined;
        this.sended = true;
        this.email = INFO.email;
        this.connectionService.getFiles().subscribe();
      },
      err => {
        console.log(err);
      }
    );
  }
}
