import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  toaster: any;
  toasterConfig: any;
  
  constructor(public toastr: ToastrService) { }

  success(message){
    this.toastr.success(message,"Success",{
      timeOut: 5000
    });    
  }

  error(message) {
    this.toastr.error(message,"Warning",{
      timeOut: 5000
    });
    
  }

  info(message) {
    this.toastr.info(message,"Info",{
      timeOut: 9000
    });
  }


  
}
