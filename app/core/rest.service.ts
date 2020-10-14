import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthUserService } from '../guards/auth-user.service';
import { DataService } from './data.service';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotificationService } from '../core/notification.service';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

const endpointMobileApi = environment.baseUrlMobileApi;
const endpointMsgCentreAPI = environment.baseUrlMsgCentre;

let header = new HttpHeaders()

@Injectable()
export class RestService {

  bsModalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: false,
    initialState: {
      name: ''
    }
  };
  
  constructor(
    private http: HttpClient,
    private auth: AuthUserService,
    public dataService: DataService,
    private notificationService:NotificationService,
    private modalService: BsModalService
  ) {
    header = header.append('Content-Type', 'application/json')
  }

  get(origin, url) {
    const endpoint = (origin === 'msgcentre') ? endpointMsgCentreAPI : endpointMobileApi;
    return this.http.get(endpoint + url).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  post(origin, url, data) {
    const endpoint = (origin === 'msgcentre') ? endpointMsgCentreAPI : endpointMobileApi;
    return this.http.post(endpoint + url, data, {
      headers: header
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  delete(origin, url, data, name) {
    return new Observable<any>(observer => {
      this.config.initialState['name'] = name;
      this.bsModalRef = this.modalService.show(ConfirmationModalComponent, Object.assign({}, this.config));
      this.bsModalRef.content.action
        .subscribe((value) => {
          console.log(value)
          if (value) {
            const endpoint = (origin === 'msgcentre') ? endpointMsgCentreAPI : endpointMobileApi;
            const options = {
              headers: header,
              body: data
            };
            return this.http.delete(endpoint + url, options).pipe(
              retry(1),
              catchError(this.handleError)
            ).subscribe((data: any )=>{
              return observer.next(data);
            });
          }else{
            return observer.next({});
          }
        }, (err) => {
          return observer.next({});
        });
    });
  }


  put(origin, url, data) {
    const endpoint = (origin === 'msgcentre') ? endpointMsgCentreAPI : endpointMobileApi;
    return this.http.put(endpoint + url, data, {
      headers: header
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.notificationService.error(errorMessage)
    return throwError(errorMessage);
  }


}
