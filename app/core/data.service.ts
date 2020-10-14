import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  /****************** Spinner Service */

  private spinnerShow = new BehaviorSubject<boolean>(false);
  getSpinnerStatus = this.spinnerShow.asObservable();

  
  sendSpinnerStatus(data:any){
    this.spinnerShow.next(data);
  }

  private showSideBar = new BehaviorSubject<boolean>(false);
  displaySideBar = this.showSideBar.asObservable();

  sideBarStatus(data:any){
    this.showSideBar.next(data);
  }

}
