import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppService } from '../../app.service';
import { RestService } from '../../core/rest.service';
import { NotificationService } from '../../core/notification.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.scss'],
    host: {
        'class': 'sidebar'
    },
    animations: [
        trigger('toggleSubMenu', [
            state('inactive', style({
                height: '0',
                opacity: '0'
            })),
            state('active', style({
                height: '*',
                opacity: '1'
            })),
            transition('inactive => active', animate('200ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ]
})
export class SidebarComponent implements OnInit {
    /* Main Menu

     * title: Main menu title
     * icon: Menu icon from material-design-iconic-fonts. Please refer 'Icons' page for more details
     * route: Router link for page
     * sub: Sub menus
     * visibility: Property for animation. 'inactive' means the sub menu is hidden by default.

     */
    redirectUrl = environment.redirectUrl;

    mainMenu: Array<any> = [];
    centreLogo: '';
    quickLinks = [];

    // Toggle sub menu
    toggleSubMenu(i) {
        this.mainMenu[i].visibility = (this.mainMenu[i].visibility === 'inactive' ? 'active' : 'inactive');
    }

    constructor(private service: AppService, 
        private restService:RestService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.fetchSideMenu();
        this.fetchquicklinks();
    }

    fetchquicklinks(){
        this.restService.get(environment.mobileApiOrigin, 'getQuicklinks').subscribe((data:any)=>{
            if(data){
                this.quickLinks = data;
                console.log(this.quickLinks);
            }
        })
    }

    addQuickLink(submenu) {
        const body = {
            link: submenu.link,
            name: submenu.name
        }
        this.restService.post(environment.mobileApiOrigin, 'addQuicklink', body).subscribe((data)=>{
            if(data){
                this.notificationService.success('Quick link added');
                this.fetchquicklinks();
            }
        });
    }

    removeQuickLink(quickLink){
        const body = {
            link: quickLink.link,
            name: quickLink.name
        }
        this.restService.post(environment.mobileApiOrigin, 'removeQuicklink', body).subscribe((data:any)=>{
            this.notificationService.success('Quick link removed');
            this.fetchquicklinks();
        })
    }

    fetchSideMenu(){
        this.restService.get(environment.mobileApiOrigin,'sidebar').subscribe((data:any)=>{
            if (data){
                this.mainMenu = data.data;
                this.centreLogo = (data.logo && data.logo.length) ? JSON.parse(data.logo[0].filename).base64.slice(2):'';
            }
        })
    }

    checkiflinkexist(sub) {
        const index = _.findIndex(this.quickLinks, (quickLink)=>{
            return quickLink.link == sub.link || quickLink.name == sub.name;
        });
        if(index > -1){
            return true;
        } else{
            return false;
        }
    }
}
