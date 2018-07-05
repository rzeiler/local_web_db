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

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  displayedColumns = ['content', 'createdate', 'total', 'repeat'];
  dataSource: MatTableDataSource<ICash>;

  private _hasCategory: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: AdService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    db.cashList.subscribe((data: ICash[]) => {
      this._hasCategory = false;
      if (data != null) {
        this._hasCategory = true;
        this.dataSource.data = data;
      }
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

  editPayment(item: ICash) {
    const editDialogRef = this.dialog.open(PaymentComponent, {
      width: '80%',
      data: { key: item.key, content: item.content, createdate: item.createdate, total: item.total, repeat: item.repeat, category: item.category }
    });

    editDialogRef.afterClosed().subscribe((cash: ICash) => {
      if (cash != undefined) {
        this.db.updateCash(cash);
      }
    });
  }

  getTotalCost() {
    return this.dataSource.data.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }
}


@Component({
  templateUrl: 'payment.component.html'
})
export class PaymentComponent {

  adForm: FormGroup;
  private title: string = "Bearbeiten";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ICash,
    private editDialogRef: MatDialogRef<PaymentComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private db: AdService) {
    this.buildForm();

    if (data.key == -1)
      this.title = "Neu";

    console.log("PaymentComponent:", data);

    this.adForm.patchValue(data);
    this.adForm.controls['_date'].setValue(new Date(data.createdate));
  }

  private buildForm() {
    this.adForm = this.fb.group({
      content: ['', Validators.required],
      total: null,
      repeat: 0,
      createdate: { value: 0, disabled: true },
      key: null,
      category: 0,
      _date: { value: 0, disabled: false, readonly: true }
    });
  }

  confirmDelete() {
    const deleteDialogRef = this.dialog.open(DeletePaymentComponent, {
      data: { key: this.data.key, title: this.data.content }
    });
    deleteDialogRef.afterClosed().subscribe((b: boolean) => {
      if (b) {
        this.editDialogRef.close(false);
        //this.db.removeCategory(this.data.key);
      }
    });
  }

  save() {
    const data = this.adForm.value;
    const newCreatedate = new Date(this.adForm.value._date).getTime();
    this.editDialogRef.close({ content: data.content, total: data.total, createdate: newCreatedate, key: data.key, repeat: data.repeat, category: data.category });
  }

}

@Component({
  templateUrl: 'delete.payment.component.html'
})
export class DeletePaymentComponent {
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
  }
}
