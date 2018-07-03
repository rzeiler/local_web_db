import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Category } from './category';
import { BehaviorSubject, Observable, Subscription } from "rxjs";


/*
https://github.com/knadh/localStorageDB
*/

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private db;

  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject('LOCALSTORAGE') private localStorage: any) {

    if (isPlatformBrowser(platformId)) {

    }


  }


  editAd(key: string, uid: string): void {
    // const ob = this.db.object<Category>('/' + uid + '/category/' + key + '/');
    // return ob;
  }

  createAd(uid: string, data: any) {
    //return this.db.list('/' + uid + '/category').push(data);
  }

  updateAd(data: string) {
    var promise = new Promise((resolve, reject) => {
      this.localStorage.setItem('categories', data);
      resolve();
    });
    return promise;
  }

  getCategories(): any {
    var now = new Date();
    const thisMonth = new Date(now.getFullYear() - 2, now.getMonth(), 1, 0, 0, 0, 0);
    const thisYear = new Date(now.getFullYear() - 2, 0, 1, 0, 0, 0, 0);
    var promise = new Promise((resolve, reject) => {
      const data = JSON.parse(this.localStorage.getItem('categories'));
      if (data) {
        data.map(x => {
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
        });
      }
      resolve(data);
    });
    return promise;
  }


}
