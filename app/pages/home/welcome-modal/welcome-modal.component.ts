import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from '../../../core/rest.service';
import { environment } from '../../../../environments/environment';
import { CurrentuserService } from '../../../shared/currentuser.service';
import { NotificationService } from '../.././../core/notification.service';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss']
})
export class WelcomeModalComponent implements OnInit {

  notificationEmailAddress: String;
  centreName: String;
  agree: Boolean = false;

  constructor(public bsModalRef: BsModalRef, 
    private restService:RestService,
    private currentuserService: CurrentuserService,
    private notificationService:NotificationService) { }

  ngOnInit() {
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo() {
    this.currentuserService.currentUser.subscribe((data) => {
      console.log(data)
      if(data && data.facility){ 
        if(data.facility.NotificationEmailAddress){
          this.notificationEmailAddress = data.facility.NotificationEmailAddress;
        }
        if(data.facility.name){
          console.log(data.facility.name)
          this.centreName = data.facility.name;
        }
      }
    })
  }

  onActivate(){
    if(this.agree){
      const body = {
        email: `${this.notificationEmailAddress},support@juniorlogs.co.nz`,
        subject: `Text messaging activation request for ${this.centreName}`,
        message: `We have received your request to activate text messaging services on Juniorlogs.
          An email is sent to Juniorlogs support to enable service and to create necessary changes on the agreement.
          One of our support staff will notify you when it is ready for you to use.
          Please let us know if you requested activation in error and if you wish to cancel.`
      };
      this.restService.post(environment.messageCentreOrigin, 'textActivationRequest', body).subscribe((data: any) => {
        this.bsModalRef.hide();
        this.notificationService.success("Activation request has been created successfully.");
      });
    } else{
      this.notificationService.error("Please agree terms of services.")
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

}
