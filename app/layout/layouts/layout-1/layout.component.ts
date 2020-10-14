import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../../../app.service';
import { DataService } from '../../../core/data.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

import { AuthUserService } from '../../../guards/auth-user.service';
import { RestService } from '../../../core/rest.service';
import { NotificationService } from '../../../core/notification.service';
import { DOCUMENT } from '@angular/common';
import { CurrentuserService } from '../../../shared/currentuser.service';
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss']
})
export class Layout1Component implements OnInit {

  maTheme: string = this.service.maTheme;
  token: string = '';
  userData: any ;
  sidebarHide = true;

  constructor(public service: AppService, private dataService: DataService,
    @Inject(DOCUMENT) private document: Document,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService,
    private restService: RestService,
    private currentuserService:CurrentuserService) { }

  ngOnInit() {
    this.subscribeSideBarStatus();
    this.subscribePararms()
  }

  subscribeSideBarStatus() {
    this.dataService.displaySideBar.subscribe((data) => {
      this.sidebarHide = data;
    })
  }

  subscribePararms() {
    this.token = ''
    this.route.queryParams
      .filter(params => params.token)
      .subscribe(params => {
        this.token = params.token;
      });
    if (this.token) {
      this.authUserService.setToken(this.token);
        this.fetchUserInfo();
        this.document.location.href = '/';
    } else if(this.authUserService.getToken()){
      this.token = this.authUserService.getToken();
      this.fetchUserInfo();
    } else {
      this.document.location.href = environment.loginUrl;
    }
  }

  fetchUserInfo(){
    this.restService.get(environment.mobileApiOrigin, 'me').subscribe((data: any) => {
      if(data) {
        this.userData = data;
        this.authUserService.setData('xyz.facility_id', data.Facility);
        this.currentuserService.changeUser(data);
      }
    })
  }
}
