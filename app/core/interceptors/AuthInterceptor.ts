import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/internal/operators';
import { NotificationService } from '../notification.service';
import { throwError } from 'rxjs';
import { AuthUserService } from '../../guards/auth-user.service';
import { LoaderService } from '../loader.service'
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  @Inject(DOCUMENT) private document: Document;
  private totalRequests = 0;

  constructor(private router: Router,
    private toastr: NotificationService,
    private auth: AuthUserService,
    private loader: LoaderService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.loader.show()
    if (this.auth.getToken() && !this.auth.getData('xyz.facility_id')) {
        request = request.clone({
          setHeaders: {
            'Content-Type':  'application/json',
            Authorization: `Bearer ${this.auth.getToken()}`
          }
        });
    }
    if (this.auth.getToken() && this.auth.getData('xyz.facility_id')) {
      request = request.clone({
        setHeaders: {
          'Content-Type':  'application/json',
          Authorization: `Bearer ${this.auth.getToken()}`,
          Facility: this.auth.getData('xyz.facility_id')
        }
      });
  }

    /**
     * continues request execution
     */
    return next.handle(request).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          this.decreaseRequests();
        }
      }),
      catchError((error, caught) => {
        this.loader.hide();
        // intercept the respons error and displace it to the console

        this.handleAuthError(error);
        return throwError(error);
      })
    );
  }

  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this.loader.hide();
    }
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    this.loader.hide();
    this.totalRequests = 0;
    console.log(err);
    // handle your auth error or rethrow
    if (err.status == 401) {
      localStorage.clear();
      // this.toastr.error('User time out');
      // alert('hi')
      window.location.href = environment.loginUrl;
      return of(err);
    }
    if(err.status == 0) {
     this.toastr.error('Network error')
    }
    throw err;
  }
}
