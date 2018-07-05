import { Component, Inject } from '@angular/core';
import { AdService } from '../ad.service';
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  private count: Observable<number>;
  private matBadgeHidden: boolean = true;

  constructor(@Inject('LOCALSTORAGE') private localStorage: any, private db: AdService) {
    this.count = db.changes;
    this.count.subscribe((count: number) => {
      if (count > 0)
        this.matBadgeHidden = false;
    });
  }

  exportToJsonFile() {
    const jsonData = JSON.parse(this.localStorage.getItem('categories'));
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }


}
