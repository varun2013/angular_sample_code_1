import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from "../../../app.service";
import { RestService } from '../../../core/rest.service';
import { environment } from '../../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ComposeModalComponent } from '../compose-modal/compose-modal.component';
import { CategoriesService } from '../../../shared/services/categories.service';
import { LabelsService } from '../../../shared/services/labels.service';

@Component({
  selector: 'app-draft-listing',
  templateUrl: './draft-listing.component.html',
  styleUrls: ['./draft-listing.component.scss']
})
export class DraftListingComponent implements OnInit {

  @ViewChild(ComposeModalComponent) child;
  @Input() sortByOrder: any;
  @Input() selectedTab: String;
  @Input() search: String;

  messageList: any = [];
  bsModalRef: BsModalRef;

  selectedCategories = localStorage.getItem('selectedCategories')?JSON.parse(localStorage.getItem('selectedCategories')):[];
  selectedLabels = localStorage.getItem('selectedLabels')?JSON.parse(localStorage.getItem('selectedLabels')):[];

  currentPage = 0;
  totalPages : number = 0;
  limit = 10;
  offset = 1;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'gray modal-lg full',
    initialState: {
      messageContent: '',
      type: 'email'
    }
  };

  constructor(private service: AppService, 
    private restService: RestService, 
    private modalService: BsModalService,
    private categoriesService: CategoriesService,
    private labelsService : LabelsService,
  ) { }

  ngOnInit() {
    this.fetchCatgoryForFilter();
    this.fetchLabelsForFilter();
  }

  

  ngOnChanges() {
    if (this.selectedTab == 'draft') {
      this.fetchMessageList();
    }
  }

  fetchCatgoryForFilter() {
    this.categoriesService.currentCategoriesForFilter.subscribe((data:any)=>{
      if (data && this.selectedTab == 'draft') {
        this.selectedCategories = data;
        this.fetchMessageList();
      }
    });
  }

  fetchLabelsForFilter() {
    this.labelsService.currentLabelsForFilter.subscribe((data:any)=>{
      if (data && this.selectedTab == 'draft') {
        this.selectedLabels = data;
        this.fetchMessageList();
      }
    })
  }

  fetchMessageList() {
    const body = {
      'status': 'draft',
      'sort': this.sortByOrder,
      'limit':this.limit,
      'skip': (this.offset-1)*this.limit,
      'labels': this.selectedLabels,
      'categories': this.selectedCategories,
      'search':this.search
    };
    this.restService.post(environment.messageCentreOrigin, 'getMesageList', body).subscribe((data: any) => {
      if(data){
        this.messageList = data.data[0].result;
        console.log(data.data[0].totalCount)
        if(data.data[0].totalCount && data.data[0].totalCount.count){
          this.totalPages = Math.ceil(data.data[0].totalCount.count / this.limit);
        }
      }
    })
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

  onEditDraft(message) {
    this.config.initialState['messageContent'] = message;
    this.bsModalRef = this.modalService.show(ComposeModalComponent,Object.assign({}, this.config));
     this.bsModalRef.content.action
      .subscribe((value) => {
        console.log(value)
        if (value) {
          this.fetchMessageList();
        }
      }, (err) => {
        return false;
      });
  }

  onDeleteDraft(message){
    console.log(message._id)
    this.restService.delete(environment.messageCentreOrigin, `deleteMessage/${message._id}`, {}, 'draft')
      .subscribe((data: any) => {
        console.log(data);
          this.fetchMessageList();
      });
  }

}
