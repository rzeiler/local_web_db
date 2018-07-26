import { Component, ViewChild, Inject, HostListener, ElementRef, Output } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdService } from '../ad.service';
import { ICategory } from "../category";
import { ICash } from '../cash';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  displayedColumns = ['option', 'content', 'createdate', 'total', 'repeat'];
  dataSource: MatTableDataSource<ICash>;

  data: any;
  
  public _hasCategory: boolean = false;
  public _category: ICategory;

  current_month :any;
 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public db: AdService, public dialog: MatDialog) {

    console.log("PaymentsComponent");

    this.dataSource = new MatTableDataSource();
    db.category.subscribe((data: any) => {
      if (data != null) {

        this._hasCategory = true;
        this._category = data;

        this.data = data.cash;
      
        const DATA = data.cash.filter(function(o) {
          if (o.isdeleted == false)
            return o;
        });

        this.dataSource.data = DATA;
        /* get all this month */
        /* first day of current month */
        const d = new Date();
        const _d = new Date(d.getFullYear(),d.getMonth(),1,0,0,0,0).getTime();
        const fd = DATA.filter(function(o) {
          if (o.createdate >= _d){
            return o;
          }
            
        });
        this.current_month = fd;

      }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // var hasScrollbar = (this.sbw.nativeElement.offsetHeight - 150) < this.div.nativeElement.scrollHeight;
    // if (hasScrollbar) {
    //   this.mySize = (this.sbw.nativeElement.offsetHeight - 150) + "px";
    // } else {
    //   this.mySize = "auto";
    // }
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

  addPayment() {
    const addDialogRef = this.dialog.open(PaymentComponent, {
      width: '80%',
      data: { key: -1, content: '', createdate: new Date(), total: 0, repeat: 0, category: 0 }
    });

    addDialogRef.afterClosed().subscribe((cash: ICash) => {
      if (cash != undefined) {
        cash.isdeleted = false;
        this.db.addPaymant(cash);
      }
    });
  }

  editPayment(item: ICash) {
    const editDialogRef = this.dialog.open(PaymentComponent, {
      width: '80%',
      data: { key: item.key, content: item.content, createdate: item.createdate, total: item.total, repeat: item.repeat, category: this._category.key }
    });

    editDialogRef.afterClosed().subscribe((cash: ICash) => {
      if (cash != undefined) {
        cash.isdeleted = false;
        this.db.updatePaymant(cash);
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
  title: string = "Bearbeiten";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICash,
    public editDialogRef: MatDialogRef<PaymentComponent>,
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
      content: ['', Validators.required],
      total: [{ value: 0 }, Validators.required],
      repeat: 0,
      createdate: { value: 0, disabled: true },
      key: null,
      category: [0, Validators.required],
      _date: { value: 0, disabled: false, readonly: true }
    });
  }

  confirmDelete() {
    const deleteDialogRef = this.dialog.open(DeletePaymentComponent, {
      data: { key: this.data.key, content: this.data.content, createdate: this.data.createdate, total: this.data.total, repeat: this.data.repeat, category: this.data.category }
    });
    deleteDialogRef.afterClosed().subscribe((b: boolean) => {
      if (b) {
        this.editDialogRef.close(false);
        this.data.isdeleted = true;
        this.db.removePaymant(this.data);
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
  content: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ICash) {
    this.content = data.content;
  }
}
