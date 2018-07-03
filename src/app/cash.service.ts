import { Injectable, Inject } from '@angular/core';
import { Cash } from './cash';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  constructor(@Inject('LOCALSTORAGE') private localStorage: any) { }

  // editAd(akey: string, bkey: string, uid: string): AngularFireObject<Cash> {
  //   const ob = this.db.object<Cash>('/' + uid + '/category/' + akey + '/cash/' + bkey + '');
  //   return ob;
  // }
  //
  // createAd(key: string, uid: string, data: any) {
  //   return this.db.list('/' + uid + '/category' + key + '/cash/').push(data);
  // }
  //
  // updateAd(ad: AngularFireObject<Cash>, data: any) {
  //   return ad.update(data)
  // }

  getCategory(id: number): any {
    var promise = new Promise((resolve, reject) => {
      const data = JSON.parse(this.localStorage.getItem('categories'));
      const cashData = data.filter(function(c) {
        if (c.key == id) {
          return c;
        }
      });
      if (cashData.length === 1) {
        resolve(cashData[0]);
      } else {
        reject("keine Dtaen gefuenden");
      }

    });
    return promise;
  }
}
