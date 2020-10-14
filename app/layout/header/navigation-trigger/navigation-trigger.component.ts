import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { DataService } from '../../../core/data.service'

@Component({
  selector: 'app-navigation-trigger',
  templateUrl: 'navigation-trigger.component.html',
  styleUrls: ['navigation-trigger.component.scss']
})
export class NavigationTriggerComponent implements OnInit {

  displaysideBar = false;

  constructor(public service: AppService,
    private dataService: DataService) { }

    openMobileSidebar() {
      this.service.mobileSidebarActive = !this.service.mobileSidebarActive;
    }
  

  openSideBar() {
    this.displaysideBar = !this.displaysideBar
    this.dataService.sideBarStatus(this.displaysideBar)
  }

  ngOnInit() {
  }

}
