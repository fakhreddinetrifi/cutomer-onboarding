import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {ConnectionService} from '../../services/connection.service';
import {CountriesService} from '../../services/countries.service';
import {Info} from '../../models/info';

@Component({
  selector: 'app-fomrs',
  templateUrl: './fomrs.component.html',
  styleUrls: ['./fomrs.component.scss']
})
export class FomrsComponent implements OnInit {
  ressoure: any;
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
  key: string;
  resId: string;
  @HostListener('input') oninput() {

    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(private router: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private connectionService: ConnectionService, public countriesService: CountriesService) {
    this.connectionService.authorization();
    this.router.params.subscribe(params => {
      if (params.id !== undefined) {
        this.resId = params.id;
      }
    });
    this.connectionService.getInit().subscribe();
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
    this.key = localStorage.getItem('key');
    console.log('key');
    console.log(this.key);
    console.log(this.resId);
    if (this.resId !== undefined) {
      // tslint:disable-next-line:radix
      this.connectionService.getRessource(parseInt(this.resId), this.key).subscribe((data: any) => {
        this.ressoure = data;
        const forms = Object.values(data.customFields);
        this.contactForm.setValue({
          gender: forms[10],
          firstname: forms[1],
          lastname: forms[0],
          dateBirth: forms[14],
          email: forms[3],
          phone: forms[2],
          address: forms[5],
          typeAccount: forms[6],
          employer: forms[12],
          addresswork: forms[13],
          idNumber: forms[4],
          total: forms[7],
          nationality: forms[11],
          attachment: '',
          sourceOfFunds: forms[8],
          buisnessActivity: forms[15]
        });
      });
    }
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
        console.log(this.currentFile)

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
      content: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
      <table>
        <tr>
          <th>Gender: </th><span hidden>54</span><td>${INFO.gender}</td>
        </tr>
        <tr>
          <th>First Name: </th><span hidden>11</span><td>${INFO.firstname}</td>
        </tr>
        <tr>
          <th>Last Name: </th><span hidden>12</span><td>${INFO.lastname}</td>
        </tr>
        <tr>
          <th>ID Number: </th><span hidden>23</span><td>${INFO.idNumber}</td>
        </tr>
        <tr>
          <th>Date Of Birth: </th><span hidden>61</span><td>${INFO.dateBirth}</td>
        </tr>
        <tr>
          <th>Email </th><span hidden>16</span><td>${INFO.email}</td>
        </tr>
        <tr>
          <th>Personal Phone: </th><span hidden>14</span><td>${INFO.phone}</td>
        </tr>
        <tr>
          <th>Address: </th><span hidden>46</span><td>${INFO.address}</td>
        </tr>
        <tr>
          <th>Nationality: </th><span hidden>55</span><td>${INFO.nationality}</td>
        </tr>
        <tr>
          <th>Employer: </th><span hidden>56</span><td>${INFO.employer}</td>
        </tr>
        <tr>
          <th>Address At Work: </th><span hidden>57</span><td>${INFO.addresswork}</td>
        </tr>
        <tr>
          <th>Account Type: </th><span hidden>50</span><td>${INFO.typeAccount}</td>
        </tr>
        <tr>
          <th>Income: </th><span hidden>52</span><td>${INFO.sourceOfFunds}</td>
        </tr>
        <tr>
          <th>Buisness Activity: </th><span hidden>62</span><td>${INFO.buisnessActivity}</td>
        </tr>
        <tr>
          <th>Salary Wages: </th><span hidden>51</span><td>${INFO.total}</td>
        </tr>
       </table>
</body>
</html>`
    };
    this.connectionService.sendEamil(body).subscribe(
      () => {
        window.scrollTo(0, 0);
        this.send = false;
        this.contactForm.reset();
        this.fileInfos = null;
        this.progress = 0;
        this.message = '';
        this.currentFile = undefined;
        this.sended = true;
        this.connectionService.getFiles().subscribe();
        this.connectionService.getInit().subscribe();
      },
      err => {
        console.log(err);
      }
    );
  }

  updateInformation() {
    this.send = true;
    const INFO: Info = this.contactForm.value;
    this.ressoure.customFields = {
      11: INFO.lastname,
      12: INFO.firstname,
      14: INFO.phone.toString(),
      16: INFO.email,
      23: INFO.idNumber,
      46: INFO.address,
      50: INFO.typeAccount,
      51: INFO.total,
      52: INFO.sourceOfFunds,
      53: Object.values(this.ressoure.customFields)[9],
      54: INFO.gender,
      55: INFO.nationality,
      56: INFO.employer,
      57: INFO.addresswork,
      61: INFO.dateBirth,
      62: INFO.buisnessActivity,
      63: Object.values(this.ressoure.customFields)[16]
    };
    const body = {
      from: INFO.email,
      content: `Information has updated`,
      to: `bhurch@mybank.com`
    };
    this.connectionService.sendEamilUpdated(body).subscribe(
      () => {
        window.scrollTo(0, 0);
        this.connectionService.updateRessource(parseInt(this.resId), this.key, this.ressoure).subscribe();
        // this.connectionService.deleteAttachment(2, this.key).subscribe();
        this.fileInfos.subscribe((value: any[]) => {
          value.forEach((data: any) => {
            this.connectionService.addAttachment(this.key, {
              resIdMaster: this.ressoure.resId,
              type: 'response_project',
              title: this.ressoure.subject,
              recipientId: null,
              recipientType: null,
              validationDate: null,
              encodedFile: data.encodedString,
              format: data.name.substring(data.name.indexOf('.') + 1),
              status: 'A_TRA'
            }).subscribe(val => console.log(val))
            console.log({
              resIdMaster: this.ressoure.resId,
              type: 'response_project',
              title: this.ressoure.subject,
              recipientId: null,
              recipientType: null,
              validationDate: null,
              encodedFile: data.encodedString,
              format: data.name.substring(data.name.indexOf('.') + 1),
              status: 'A_TRA'
            });
          });
        })
        this.send = false;
        this.contactForm.reset();
        this.fileInfos = null;
        this.progress = 0;
        this.message = '';
        this.currentFile = undefined;
        this.sended = true;
        this.connectionService.getFiles().subscribe();
        this.connectionService.getInit().subscribe();
        localStorage.clear();
      },
      err => {
        console.log(err);
      }
    );
  }
}
