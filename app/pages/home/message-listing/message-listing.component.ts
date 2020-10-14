import { Component, OnInit, Input } from '@angular/core';
import { AppService } from "../../../app.service";
import { RestService } from '../../../core/rest.service';
import { environment } from '../../../../environments/environment';
import { CategoriesService } from '../../../shared/services/categories.service';
import { TabHeadingDirective } from 'ngx-bootstrap';
import { LabelsService } from '../../../shared/services/labels.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-message-listing',
  templateUrl: './message-listing.component.html',
  styleUrls: ['./message-listing.component.scss']
})
export class MessageListingComponent implements OnInit {

  @Input() sortByOrder: any ;
  @Input() selectedTab: String;
  @Input() search: String;
 
  todoLists: any = [];
  todoListActions: any = [];
  messageList: any = [];
  offset = 1;
  currentPage = 0;
  totalPages : number = 0;
  limit = 10;
  selectedCategories = localStorage.getItem('selectedCategories')?JSON.parse(localStorage.getItem('selectedCategories')):[];
  selectedLabels = localStorage.getItem('selectedLabels')?JSON.parse(localStorage.getItem('selectedLabels')):[];

  constructor(private service: AppService, 
    private restService: RestService,
    private categoriesService: CategoriesService,
    private labelsService: LabelsService,
    private router: Router) {
    this.todoLists = service.todoLists;
    this.todoListActions = service.todoListActions;
  }

  ngOnInit() {
    this.fetchCatgoryForFilter();
  }

  ngOnChanges() {
    if(this.selectedTab == 'message'){
      this.fetchMessageList();
      this.fetchLabelsForFilter();
    }
  }

  fetchCatgoryForFilter() {
    this.categoriesService.currentCategoriesForFilter.subscribe((data:any)=>{
      console.log(data);
      if (data && this.selectedTab == 'message') {
        this.selectedCategories = data;
        this.fetchMessageList();
      }
    });
  }

  fetchLabelsForFilter() {
    this.labelsService.currentLabelsForFilter.subscribe((data:any)=>{
      if (data && this.selectedTab == 'message') {
        this.selectedLabels = data;
        this.fetchMessageList();
      }
    })
  }

  fetchMessageList() {
    const body = {
      'status': 'sent',
      'sort':this.sortByOrder,
      'limit':this.limit,
      'skip': (this.offset-1)*this.limit,
      'labels': this.selectedLabels,
      'categories': this.selectedCategories,
      'search':this.search
    }
    this.restService.post(environment.messageCentreOrigin, 'getMesageList', body).subscribe((data: any) => {
      // console.log(data);
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

  onRecieveValues(ev){
    this.offset = ev.offset;
    this.currentPage = ev.currentPage;
    console.log('dasfdas')
    this.fetchMessageList();
  }

  onDoubleClick(message) {
    this.router.navigate(['/messages', message._id] )
  }


}
