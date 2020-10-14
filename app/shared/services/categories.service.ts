import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categories = new BehaviorSubject<any>('');
  currentCategories = this.categories.asObservable();

  private categoriesForFilter = new BehaviorSubject<any>(false);
  currentCategoriesForFilter = this.categoriesForFilter.asObservable();

  constructor() { }

  updateCategories(categories: any) {
    this.categories.next(categories);
  }

  updateCategoriesForFilter(categories:any) {
    console.log(categories)
    this.categoriesForFilter.next(categories);
  }
}
