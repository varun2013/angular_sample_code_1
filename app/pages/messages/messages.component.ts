import { Component, OnInit } from '@angular/core';
import { RestService } from '../../core/rest.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  pageTitle: string = 'Messages';
  messageDetails: any;
  messagesSearch: boolean = false;
  messageRecipients: any = [];

  private routeSub: Subscription;
  constructor(private restService: RestService,
    private route: ActivatedRoute,
    private router: Router ) {
  }

  ngOnInit() {
    this.subscribePararms();
  }

  getMessageDetail(id) {
    this.restService.post(environment.messageCentreOrigin, `getMessageDetail/${id}`, {})
      .subscribe((data: any) => {
        if (data.data.length) {
          this.messageDetails = data.data[0];
          console.log(this.messageDetails);
          this.messageRecipients = this.messageDetails.recipients ? this.messageDetails.recipients : [];
        }
      });
  }

  subscribePararms() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.getMessageDetail(params['id']);
      } else {

      }
    });
  }

  getColor(index) {
    const i = index % 8;
    switch (i) {
      case 0:
        return 'red';
      case 1:
        return 'light-blue';
      case 2:
        return 'amber';
      case 3:
        return 'lime';
      case 4:
        return 'green';
      case 5:
        return 'teal';
      case 6:
        return 'purple';
      case 7:
        return 'pink';
      case 8:
        return 'cyan';
      default:
        break;
    }
  }

  onDeleteMessage() {
    this.restService.delete(environment.messageCentreOrigin, `deleteMessage/${this.messageDetails._id}`, {}, 'message')
      .subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['/home']);
      });
  }
}
