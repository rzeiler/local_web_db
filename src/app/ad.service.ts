import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ICategory } from './category';
import { ICash } from './cash';
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private _list: ICategory[] = [];
  private _observableList: BehaviorSubject<ICategory[]> = new BehaviorSubject([]);



  //private _cashList: ICash[] = [];
  private _observableCashList: BehaviorSubject<ICash[]> = new BehaviorSubject([]);


  private _changes: BehaviorSubject<number> = new BehaviorSubject(0);

  get observableList(): Observable<ICategory[]> { return this._observableList.asObservable() }

  //  get cashList(): Observable<ICash[]> { return this._observableCashList.asObservable() }

  get changes(): Observable<number> { return this._changes.asObservable() }

  private _category: ICategory;
  private _observableCategory: BehaviorSubject<ICategory> = new BehaviorSubject(null);
  get category(): Observable<ICategory> { return this._observableCategory.asObservable() }


  constructor(@Inject('LOCALSTORAGE') private localStorage: any) {
    this.getCategories();
    this.trackChanges(false);
  }

  storeData() {
    const json = JSON.stringify(this._list);
    this.localStorage.setItem('categories', json);
    this.trackChanges();
  }

  addPaymant(newCash: ICash) {
    const newIndex = this._category.cash.length;
    newCash.key = newIndex;
    this._category.cash.push(newCash);
    this._list.map((category: ICategory) => {
      if (category.key == newCash.category) {
        category = this._category;
      }
    });
    this._observableCategory.next(this._category);
    this.storeData();
  }

  updatePaymant(updatetedCash: ICash) {
    this._category.cash[updatetedCash.key] = updatetedCash;
    this._observableCategory.next(this._category);
    this.storeData();
  }

  removePaymant(rmCash: ICash) {
    /* update cash*/
    this._category.cash.map((cash: ICash) => {
      if (cash.key == rmCash.key) {
        cash.isdeleted = rmCash.isdeleted;
      }
    });
    /* update category */
    this._list.map((category: ICategory) => {
      if (category.key == rmCash.category) {
        category = this._category;
      }
    });
    this.storeData();
  }

  removeCategory(rmCategory: ICategory) {
    this._list.map((category: ICategory) => {
      if (category.key == rmCategory.key) {
        category.isdeleted = rmCategory.isdeleted;
      }
    });
    this._observableList.next(this._list);
    this.storeData();
  }

  addCategory(category: ICategory) {
    var length = this._list.length;
    category.key = length;
    this._list.push(category);
    this._observableList.next(this._list);
    this.storeData();
  }

  updateCategory(updatedCategory: ICategory) {
    this._list.map((category: ICategory) => {
      if (category.key == updatedCategory.key) {
        category.title = updatedCategory.title;
        category.rating = updatedCategory.rating;
        category.createdate = updatedCategory.createdate;
      }
    });
    this._observableList.next(this._list);
    this.storeData();
  }

  trackChanges(get: boolean = true): void {
    let count = this.localStorage.getItem('tracker');
    if (count == null)
      count = 0;
    if (get)
      count++;
    this.localStorage.setItem('tracker', count);
    this._changes.next(count);
  }

  setData(_list: string) {
    /* save data */
    this.localStorage.setItem('categories', JSON.stringify(_list));
    this.getCategories()
  }

  setCashs(category: ICategory): void {
    this._category = category;
    this._observableCategory.next(this._category);
  }

  getCategories(): void {
    this._list = [];
    var now = new Date();
    const thisMonth = new Date(now.getFullYear() - 2, now.getMonth(), 1, 0, 0, 0, 0);
    const thisYear = new Date(now.getFullYear() - 2, 0, 1, 0, 0, 0, 0);
    const data = JSON.parse(this.localStorage.getItem('categories'));

    if (data) {
      data.map((x: ICategory) => {
        // let sum = 0;
        // const cashMonth = x.cash.filter(function(el) {
        //   if (new Date(el.createdate) >= thisMonth) {
        //     return el;
        //   }
        // });
        // cashMonth.map(y => {
        //   sum += y.total;
        // });
        // x.sumMonth = sum;
        // sum = 0;
        // const cashYear = x.cash.filter(function(el) {
        //   if (new Date(el.createdate) >= thisYear) {
        //     return el;
        //   }
        // });
        // cashYear.map(y => {
        //   sum += y.total;
        // });
        // x.sumYear = sum;
        /* add to list */
        this._list.push(x);
      });
    }
    this._observableList.next(this._list);
  }


}
