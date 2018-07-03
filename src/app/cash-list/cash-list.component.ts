import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs";
import { CashService } from '../cash.service';
import { Category } from "../category";
import { Cash } from "../cash";

@Component({
  selector: 'app-cash-list',
  templateUrl: './cash-list.component.html',
  styleUrls: ['./cash-list.component.css']
})
export class CashListComponent {



  cashItems: Category;

  constructor(private db: CashService, public route: ActivatedRoute, public router: Router) {

    route.params.subscribe(params => {

      db.getCategory(params.id).then((category: Category) => {
        this.cashItems = category;
      });


    });
  }

}
