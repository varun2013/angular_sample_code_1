import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input('totalPages') totalPages: any;
  @Input('currentPage') currentPage : any;
	@Output() recieveValues = new EventEmitter<any>();


	offset: any;
	prevDisable: any;
	nextDisable: any;
	pagination: any = [ ];
	previousPageCount : any;

  pagerLimit: any = 3;
  morePages:boolean = false;
  morePrevious: boolean = false;
  pages:any =[];
  totalPagesForpager:any


  constructor() { }

  ngOnInit() {
  }

  initPaginator(){
    if (this.totalPages>3) {
      this.pagerLimit = 3
    }else{
      this.pagerLimit = this.totalPagesForpager;
    }

    this.arrayPager(this.pagerLimit,this.currentPage==0?1:this.currentPage)
  }

  arrayPager(n: number, startFrom: number) {
    if(startFrom>(this.totalPagesForpager-n)){
      this.morePages = false;
      this.arrayPager(this.pagerLimit,this.totalPagesForpager-n);
      return;
    }
    this.pages =Array.from(Array(n).keys()).map(i => {
      return i + startFrom -1
    });
    if (this.currentPage<this.totalPagesForpager-n) {
      this.morePages = true;
    }

    if (this.currentPage>=2 && this.totalPages>5) {
      this.morePrevious = true;
    }else{
      this.morePrevious = false
    }
  }

  ngOnChanges(){
    if (this.totalPages > 1 ) {
      // this.totalPages = 10
      this.totalPagesForpager=this.totalPages;
      this.initPaginator();
    }
  }

  goToPage(i) {
    if (i >= 0 && i < this.totalPages) {
      this.currentPage = i;
      i = i + 1;
      this.offset = i;
      if (this.offset == 1) {
        this.prevDisable = true;
        this.nextDisable = false;
      }
      else if (this.offset == this.totalPages) {
        this.prevDisable = false;
        this.nextDisable = true;
      }
      else {
        this.prevDisable = false;
        this.nextDisable = false;
      }
      var data = {
      	offset: this.offset,
      	currentPage: this.currentPage
      }
      this.recieveValues.emit(data);
    }
  }

  navigationBtn(event) {
    if (event == 'prev') {
      this.currentPage = 0;
      this.offset = 1;
      this.prevDisable = true;
      this.nextDisable = false;
    }
    else if (event == 'next') {
      this.currentPage = this.totalPages - 1;
      this.offset = this.totalPages;
      this.prevDisable = false;
      this.nextDisable = true;
    }
    var data = {
      offset: this.offset,
     	currentPage: this.currentPage
    }
    this.recieveValues.emit(data);
  }

}
