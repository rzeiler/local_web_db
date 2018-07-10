import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BehaviorSubject, Observable, of, Subject } from "rxjs";

import { delay, share } from 'rxjs/operators';

import { AdService } from '../ad.service';
import { ICategory } from "../category";
import { ICash } from '../cash';

const ratingSelection = ['Unbestimmt', 'Weniger', 'Manchmal', 'Nicht so oft', 'Etwas öffters', 'Oft'];

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  displayedColumns = ['option', 'title'];
  dataSource: MatTableDataSource<ICategory>;

  public _observableList: Observable<ICategory[]>;
  public _category: ICategory;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public db: AdService, public dialog: MatDialog) {

    this.dataSource = new MatTableDataSource();
    this._observableList = this.db.observableList;

    this._observableList.subscribe((data: any) => {
      this.dataSource.data = data.filter(function(o) {
        if (o.isdeleted == false)
          return o;
      });
    });
  }



  ngOnInit() {
    this.db.getCategories();
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

  openPayments(item: ICategory) {
    this.db.setCashs(item);
  }

  print(index: number) {
    return ratingSelection[index];
  }

  costByCategorMonth(category: ICategory): number {
    var now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const payments = category.cash.filter(function(b) { return (!b.isdeleted) ? b : null });
    const yearPayments = payments.filter(function(b) {
      if (b.createdate >= thisMonth.getTime())
        return b;
    });
    let r = yearPayments.map(t => t.total).reduce((acc, value) => acc + value, 0);
    return r;
  }

  costByCategoryYear(category: ICategory): number {
    var now = new Date();
    const thisYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const payments = category.cash.filter(function(b) { return (!b.isdeleted) ? b : null });
    const yearPayments = payments.filter(function(b) {
      if (b.createdate >= thisYear.getTime())
        return b;
    });
    let r = yearPayments.map(t => t.total).reduce((acc, value) => acc + value, 0);
    return r;
  }



  addCategory() {
    const dialogRef = this.dialog.open(CategoryComponent, {
      width: '80%',
      data: { key: -1, title: '', createdate: new Date().getTime(), rating: 0 }
    });

    dialogRef.afterClosed().subscribe((category: ICategory) => {
      if (category != undefined) {
        category.cash = [];
        category.isdeleted = false;
        this.db.addCategory(category);
      }
    });
    return false;
  }

  editCategory(item: ICategory) {
    const dialogRef = this.dialog.open(CategoryComponent, {
      width: '80%',
      data: { key: item.key, title: item.title, createdate: item.createdate, rating: item.rating }
    });

    dialogRef.afterClosed().subscribe((category: ICategory) => {
      if (category != undefined)
        this.db.updateCategory(category);
    });
    return false;
  }

}

@Component({
  templateUrl: 'category.component.html'
})
export class CategoryComponent {

  adForm: FormGroup;
  title: string = "Bearbeiten";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICategory,
    public editDialogRef: MatDialogRef<CategoryComponent>,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public snackBar: MatSnackBar,
    public db: AdService) {
    this.buildForm();

    if (data.key == -1)
      this.title = "Neu";

    this.adForm.patchValue(data);
    this.adForm.controls['_date'].setValue(new Date(data.createdate));
  }

  public buildForm() {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      rating: null,
      createdate: { value: 0, disabled: true },
      key: null,
      _date: { value: 0, disabled: false, readonly: true }
    });
  }

  confirmDelete() {
    const deleteDialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: { key: this.data.key, title: this.data.title }
    });
    deleteDialogRef.afterClosed().subscribe((b: boolean) => {
      if (b) {
        this.editDialogRef.close(false);
        this.data.isdeleted = true;
        this.db.removeCategory(this.data);
      }
    });
  }

  save() {
    const data = this.adForm.value;
    const newCreatedate = new Date(this.adForm.value._date).getTime();
    this.editDialogRef.close({ title: data.title, rating: data.rating, createdate: newCreatedate, key: data.key });
  }

}

@Component({
  templateUrl: 'delete.category.component.html'
})
export class DeleteCategoryComponent {
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
  }
}
