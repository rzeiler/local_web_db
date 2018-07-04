import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { AdService } from '../ad.service';
import { Observable } from "rxjs";
import { ICategory } from "../category";
import { ICash } from '../cash';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  displayedColumns = ['title', 'sumYear', 'sumMonth'];
  dataSource: MatTableDataSource<ICash>;

  private _observableList: Observable<ICategory[]>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private db: AdService) {

    this.dataSource = new MatTableDataSource();
    this._observableList = db.observableList;

    db.getCategories();

    this._observableList.subscribe((data: any) => {
      this.dataSource.data = data;

    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openItem(item: ICategory) {
    //console.log(item);
    this.db.setCashs(item.key);
    //this.router.navigate(['category', item.category, 'cash', item.key]);
  }


}
