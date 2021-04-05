
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ConnectionService} from './services/connection.service';
import {Info} from './models/info';
import {Observable} from 'rxjs';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {CountriesService} from './services/countries.service';
import {tap} from 'rxjs/operators';
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
  email: string;
  @HostListener('input') oninput() {

    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(private fb: FormBuilder, private connectionService: ConnectionService, public countriesService: CountriesService) {
    this.connectionService.getInit().subscribe()
    this.contactForm = fb.group({
     // salutation: ['', Validators.required],
      gender: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      dateBirth: ['', Validators.required],
     // placeBirth: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.required],
     // workphone: [''],
      address: ['', Validators.required],
      typeAccount: ['', Validators.required],
      employer: ['', Validators.required],
      addresswork: ['', Validators.required],
      idNumber: ['', Validators.required],
      total: ['', Validators.required],
      nationality: ['', Validators.required],
     // marital: ['', Validators.required],
      attachment: ['', Validators.required],
      sourceOfFunds: ['', Validators.required],
      buisnessActivity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.connectionService.maarchcourrier().pipe(
      tap((data: any) => {
        console.log('Token ==> ' + data.headers.get('Token'))
        console.log('Refresh-Token ==> ' + data.headers.get('Refresh-Token'))
      })
    ).subscribe();
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
        '    <th>Gender: </th><span hidden>54</span><td>' + INFO.gender + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>First Name: </th><span hidden>11</span><td>' + INFO.firstname + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Last Name: </th><span hidden>12</span><td>' + INFO.lastname + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>ID Number: </th><span hidden>23</span><td>' + INFO.idNumber + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Date Of Birth: </th><span hidden>61</span><td>' + INFO.dateBirth + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Email </th><span hidden>16</span><td>' + INFO.email + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Personal Phone: </th><span hidden>14</span><td>' + INFO.phone + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Address: </th><span hidden>46</span><td>' + INFO.address + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Nationality: </th><span hidden>55</span><td>' + INFO.nationality + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Employer: </th><span hidden>56</span><td>' + INFO.employer + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Address At Work: </th><span hidden>57</span><td>' + INFO.addresswork + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Account Type: </th><span hidden>50</span><td>' + INFO.typeAccount + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Income: </th><span hidden>52</span><td>' + INFO.sourceOfFunds + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Buisness Activity: </th><span hidden>62</span><td>' + INFO.buisnessActivity + '</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <th>Salary Wages: </th><span hidden>51</span><td>' + INFO.total + '</td>' +
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
        this.connectionService.getInit().subscribe();
      },
      err => {
        console.log(err);
      }
    );
  }
}
