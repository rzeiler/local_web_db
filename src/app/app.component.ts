import { Component } from '@angular/core';
import { AdService } from './ad.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private db: AdService, private router: Router) {
    db.observableList.subscribe(data => {
      if (data.length === 0)
        router.navigate(['settings']);
    });
  }
}
