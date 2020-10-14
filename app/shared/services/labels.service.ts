import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  private labels = new BehaviorSubject<any>('');
  currentLabels = this.labels.asObservable();

  private labelsForFilter = new BehaviorSubject<any>('');
  currentLabelsForFilter = this.labelsForFilter.asObservable();

  constructor() { }

  updateLabels(labels: any) {
    this.labels.next(labels);
  }

  updateLabelsForFilter(labels: any) {
    this.labelsForFilter.next(labels);
  }

}
