import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ComposeModalComponent } from './compose-modal/compose-modal.component';
import { MessageListingComponent } from './message-listing/message-listing.component';
import { TabDirective, TabHeadingDirective } from 'ngx-bootstrap/tabs';
import { DraftListingComponent } from './draft-listing/draft-listing.component';
import { TabsetComponent } from 'ngx-bootstrap';
import { CategoriesService } from '../../shared/services/categories.service';
import { LabelsService } from '../../shared/services/labels.service';
import { Subscription } from 'rxjs';
import { CurrentuserService } from '../../shared/currentuser.service';
import * as _ from 'lodash';
import { WelcomeModalComponent } from './welcome-modal/welcome-modal.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild(ComposeModalComponent) child;
  @ViewChild('messageListing') messageListing: MessageListingComponent;
  @ViewChild('draftListing') dratListing: DraftListingComponent;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  bsModalRef: BsModalRef;
  showSearch: boolean = false;
  sortByOrder: any = localStorage.getItem('listSortorder') ? JSON.parse(localStorage.getItem('listSortorder')) : {'created':-1};
  selectedTab = 'message';
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'gray modal-lg full',
    initialState: {
      type: ''
    }
  };
  tabs: any[] = [];

  labels = [];
  categories = [];
  $categorysubscription: Subscription;
  $labelSubscription: Subscription;
  $userSubscription: Subscription;
  selectedCategories = [];
  selectedLabels = [];
  textMessage = false;
  search:'';

  constructor(private modalService: BsModalService, 
    private categoriesService: CategoriesService,
    private labelsService: LabelsService,
    private currentuserService: CurrentuserService) { }

  ngOnInit() {
    this.getLabels();
    this.getCategories();
    this.checkTextMessageEnabled();
  }

  getLabels(){
    if(localStorage.getItem('selectedLabels')){
      this.selectedLabels = JSON.parse(localStorage.getItem('selectedLabels'));
      console.log(this.selectedLabels, 'ssdsdasd')
    }
    this.$labelSubscription = this.labelsService.currentLabels.subscribe((data:any)=>{
      this.labels = data;
    })
  }

  getCategories(){
    if(localStorage.getItem('selectedCategories')){
      this.selectedCategories = JSON.parse(localStorage.getItem('selectedCategories'));
    }
    this.$categorysubscription = this.categoriesService.currentCategories.subscribe((data:any)=>{
      this.categories = data;
    });
  }

  checkTextMessageEnabled() {
    this.$userSubscription = this.currentuserService.currentUser.subscribe((data: any) => {
      if(data){
        this.textMessage = data.facility.TextMessage;
        console.log(this.textMessage);
      }
    });
  }

  openModal(type) {
    this.config.initialState['type'] = type;
    this.bsModalRef = this.modalService.show(ComposeModalComponent,Object.assign({}, this.config));
    this.bsModalRef.content.action
      .subscribe((value) => {
        console.log(value)
        if (value) {
          if(this.selectedTab == 'message'){
            this.messageListing.fetchMessageList();
          } else{
            this.dratListing.fetchMessageList();
          }
        }
      }, (err) => {
        return false;
      });
  }

  changeSearchView(val) {
    this.search = '';
    this.showSearch = val;
  }

  onSelectTab(tab){
    this.selectedTab = tab;
  }

  sortBy(object){
    this.sortByOrder = object;
    localStorage.setItem('listSortorder', JSON.stringify(object));
  }

  addNewTab(): void {
    const newTabIndex = this.tabs.length + 1;
    this.tabs.push({
      title: `Dynamic Title ${newTabIndex}`,
      content: `Dynamic content ${newTabIndex}`,
      disabled: false,
      removable: true
    });
    this.staticTabs.tabs[2].active = true;
  }

  removeTabHandler(tab: any): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    console.log('Remove Tab handler');
  }

  onSelectCategory(category) {
    const index = _.findIndex(this.selectedCategories, (cat)=>{
      return cat == category
    });
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      _.remove(this.selectedCategories, (cat)=>{
        return cat == category;
      });
    }
    // console.log(this.selectedCategories);
    localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    this.categoriesService.updateCategoriesForFilter(this.selectedCategories);
  };

  onSelectLabels(label) {
    const index = _.findIndex(this.selectedLabels, (lab)=>{
      return lab == label;
    });
    if (index === -1) {
      this.selectedLabels.push(label);
    } else {
      _.remove(this.selectedLabels, (lab)=>{
        return lab == label;
      });
    }
    // console.log(this.selectedLabels);
    localStorage.setItem('selectedLabels', JSON.stringify(this.selectedLabels));
    this.labelsService.updateLabelsForFilter(this.selectedLabels);
  };

  isLabelSelected(label) {
    const index = _.findIndex(this.selectedLabels, (lab)=>{
      return lab == label;
    });
    if (index > -1) {
      return true;
    } else{
      false
    }
  }

  isCategorySelected(category) {
    const index = _.findIndex(this.selectedCategories, (cat)=>{
      return cat == category;
    });
    if (index > -1) {
      return true;
    } else{
      false
    }
  }

  ngOnDestroy() {
    if (this.$categorysubscription) { this.$categorysubscription.unsubscribe(); };
    if (this.$labelSubscription) { this.$labelSubscription.unsubscribe(); };
    if (this.$userSubscription) { this.$userSubscription.unsubscribe(); };
  }


  openWelcomeModal() {
    this.bsModalRef = this.modalService.show(WelcomeModalComponent,Object.assign({}, this.config));
    
  }

}
