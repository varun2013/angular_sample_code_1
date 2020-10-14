import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CurrentuserService {

  private userSource = new BehaviorSubject<any>('');
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(User: any) {
    console.log(User);
    this.userSource.next(User)
  }

}
