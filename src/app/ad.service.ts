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



  private _cashList: ICash[] = [];
  private _observableCashList: BehaviorSubject<ICash[]> = new BehaviorSubject([]);


  private _changes: BehaviorSubject<number> = new BehaviorSubject(0);

  get observableList(): Observable<ICategory[]> { return this._observableList.asObservable() }

  get cashList(): Observable<ICash[]> { return this._observableCashList.asObservable() }

  get changes(): Observable<number> { return this._changes.asObservable() }

  // private _observableCategory: BehaviorSubject<ICategory> = new BehaviorSubject(null);
  // get category(): Observable<ICategory> { return this._observableCategory.asObservable() }


  constructor(@Inject('LOCALSTORAGE') private localStorage: any) {
    this.getCategories();
    this.trackChanges(false);
  }

  updateCash(updatedCash: ICash) {
    let data = JSON.parse(this.localStorage.getItem('categories'));
    data.map((category: ICategory) => {
      if (category.key == updatedCash.category) {
        category.cash.map((cash: ICash) => {
          if (cash.key == updatedCash.key) {
            cash.content = updatedCash.content;
            cash.total = updatedCash.total;
            cash.repeat = updatedCash.repeat;
            cash.createdate = updatedCash.createdate;
            console.log(cash);
          }
        });
      }
    });
    this.trackChanges();
    this.setData(data);
  }

  removeCategory(key: number) {
    const data = JSON.parse(this.localStorage.getItem('categories'));
    let _data = data.filter(function(el) {
      if (el.key !== key) {
        return el;
      }
    });
    this.trackChanges();
    this.setData(_data);
  }

  addCategory(category: ICategory) {
    let data = JSON.parse(this.localStorage.getItem('categories'));
    var length = data.length;
    category.key = length;
    data[length] = category;
    this.trackChanges();
    this.setData(data);
  }

  updateCategory(updatedCategory: ICategory) {
    let data = JSON.parse(this.localStorage.getItem('categories'));
    data.map((category: ICategory) => {
      if (category.key == updatedCategory.key) {
        category.title = updatedCategory.title;
        category.rating = updatedCategory.rating;
        category.createdate = updatedCategory.createdate;
      }
    });
    this.trackChanges();
    this.setData(data);
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


  editAd(key: string, uid: string): void {
    // const ob = this.db.object<Category>('/' + uid + '/category/' + key + '/');
    // return ob;
  }

  createAd(uid: string, data: any) {
    //return this.db.list('/' + uid + '/category').push(data);
  }



  setCashs(key: number): void {
    this._cashList = [];
    this._list.map((category: ICategory) => {
      if (category.key == key)
        this._cashList = category.cash;
    });
    this._observableCashList.next(this._cashList);
  }

  getCategories(): void {
    this._list = [];
    var now = new Date();
    const thisMonth = new Date(now.getFullYear() - 2, now.getMonth(), 1, 0, 0, 0, 0);
    const thisYear = new Date(now.getFullYear() - 2, 0, 1, 0, 0, 0, 0);
    const data = JSON.parse(this.localStorage.getItem('categories'));
    if (data) {
      data.map((x: ICategory) => {
        let sum = 0;
        const cashMonth = x.cash.filter(function(el) {
          if (new Date(el.createdate) >= thisMonth) {
            return el;
          }
        });
        cashMonth.map(y => {
          sum += y.total;
        });
        x.sumMonth = sum;
        sum = 0;
        const cashYear = x.cash.filter(function(el) {
          if (new Date(el.createdate) >= thisYear) {
            return el;
          }
        });
        cashYear.map(y => {
          sum += y.total;
        });
        x.sumYear = sum;
        /* add to list */
        this._list.push(x);
      });
    }
    this._observableList.next(this._list);
  }


}
