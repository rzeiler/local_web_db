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

  get observableList(): Observable<ICategory[]> { return this._observableList.asObservable() }

  get cashList(): Observable<ICash[]> { return this._observableCashList.asObservable() }

  constructor(@Inject('LOCALSTORAGE') private localStorage: any) {
    this.getCategories();
  }

  addCategory(category: ICategory) {
    this._list.push(category);
    this._observableList.next(this._list);
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
