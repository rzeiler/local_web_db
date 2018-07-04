import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { AdService } from '../ad.service';
import { Observable } from "rxjs";
import { ICategory } from "../category";
import { ICash } from '../cash';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  displayedColumns = ['content', 'createdate', 'total', 'repeat'];
  dataSource: MatTableDataSource<ICash>;

  private _observableList: Observable<ICash[]>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private db: AdService) {

    this.dataSource = new MatTableDataSource();
    this._observableList = db.cashList;

    route.params.subscribe(params => {
      if (params.id != undefined) {
        db.setCashs(params.id);
      }
    });

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

  openItem(item: ICash) {
    console.log(item);
    this.router.navigate(['category', item.category, 'cash', item.key]);
  }

  getTotalCost() {
    return this.dataSource.data.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }
}
