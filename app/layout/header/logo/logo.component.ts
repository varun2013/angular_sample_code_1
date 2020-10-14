import { Component, OnInit, Inject, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { AuthUserService } from '../../../guards/auth-user.service';
import { CurrentuserService } from '../../../shared/currentuser.service';
@Component({
  selector: 'app-logo',
  templateUrl: 'logo.component.html',
  styleUrls: ['logo.component.scss']
})
export class LogoComponent implements OnInit {

  facility: any;
  user: any;
  headerTitle: any = '';
  redirectUrl = environment.redirectUrl;

  constructor(@Inject(DOCUMENT) private document: Document,
    private authUserService: AuthUserService,
    private currentuserService: CurrentuserService) { }

  ngOnInit() {
    this.currentuserService.currentUser.subscribe(user => {
      if (user) {
        this.user = user;
        console.log('====================================');
        console.log(user);
        console.log('====================================');
        var center = user.facility;
        var reg = user.Region ? user.Region.name : "(No Region)";
        var comp = user.Company ? user.Company.name : "(No Organisation)";
        if (user.role.index == 0) {
          this.headerTitle = "System Portal: " + center.name + " - " + reg + " - " + comp;// (" + currentUser.centerName + ")";
        } else if (user.role.index == 1) {
          this.headerTitle = "Admin Portal: " + center.name;// (" + currentUser.centerName + ")";
        } else if (user.role.index == 4) {
          this.headerTitle = comp + " Admin Portal:" + reg + " - " + center.name;// ("+currentUser.centerName+")";
        } else if (user.role.index == 6) {
          this.headerTitle = reg + "  Admin Portal: " + center.name;// ("+currentUser.centerName+")";
        }
      }
    });
  }

  getFacility() {
    this.facility = this.authUserService.getData('xyz.facility_id').toString();
  }

  navigateTo(url) {
    if (url == 'main/formly/edit/facility/') {
      // alert(`${environment.redirectUrl}${url}${this.user.facility._id}`);
      this.document.location.href = `${environment.redirectUrl}${url}${this.user.facility._id}`;
    }
    this.document.location.href = `${environment.redirectUrl}${url}`;
  }

  checkRole(str) {
    if ( !this.user || !this.user.role ) {
      return false;
    }
    const role = this.user.role.type;
    if ( role === 'SYSTEM_ADMIN_ROLE' ) {
      return true;
    } else if ( role === 'COMPANY_ADMIN_ROLE' && str !== 'SYSTEM_ADMIN_ROLE' ) {
      return true;
    } else if ( role === 'REGION_ADMIN_ROLE' && (str !== 'SYSTEM_ADMIN_ROLE' && str !== 'COMPANY_ADMIN_ROLE' )) {
      return true;
    } else if ( role === 'FACILITY_ADMIN_ROLE' && str === 'FACILITY_ADMIN_ROLE' ) {
      return true;
    } else {
      return false;
    }
  }

  onLogout(){
    localStorage.clear();
    this.document.location.href = environment.redirectUrl;
  }

}
