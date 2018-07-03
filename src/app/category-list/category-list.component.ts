import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';
import { Observable } from "rxjs";
import { Category } from "../category";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {

  categoryItems: Observable<Category[]>

  constructor(private db: AdService) {
    db.getCategories().then(d => {
      this.categoryItems = d;
    });
  }

}
