import { Component, ViewChild, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { AdService } from '../ad.service';
import { Observable } from "rxjs";
import { ICategory } from "../category";
import { ICash } from '../cash';

const ratingSelection = ['Unbestimmt','Weniger','Manchmal','Nicht so oft','Etwas öffters','Oft'];

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  displayedColumns = ['title', 'rating'];
  dataSource: MatTableDataSource<ICash>;

  private _observableList: Observable<ICategory[]>
  private _category: ICategory;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: AdService, public dialog: MatDialog) {

    this.dataSource = new MatTableDataSource();
    this._observableList = db.observableList;

    db.getCategories();

    this._observableList.subscribe((data: any) => {
      this.dataSource.data = data.filter(function(o) {
        if (o.isdeleted == false)
          return o;
      });
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

  openPayments(item: ICategory) {
    this.db.setCashs(item);
  }

  print(index: number) {
    return ratingSelection[index];
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
  }

}

@Component({
  templateUrl: 'category.component.html'
})
export class CategoryComponent {

  adForm: FormGroup;
  private title: string = "Bearbeiten";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ICategory,
    private editDialogRef: MatDialogRef<CategoryComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private db: AdService) {
    this.buildForm();

    if (data.key == -1)
      this.title = "Neu";

    this.adForm.patchValue(data);
    this.adForm.controls['_date'].setValue(new Date(data.createdate));
  }

  private buildForm() {
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
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
  }
}
